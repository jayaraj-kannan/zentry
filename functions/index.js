const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Trigger: When a user sends an SOS alert
 * Explicitly setting region to us-central1 to ensure connectivity with the UI deployment
 */
exports.onsostrigger = onDocumentCreated({
  document: "sos_alerts/{alertId}",
  region: "us-central1"
}, async (event) => {
  console.log(`[Trigger] onsostrigger fired for document: ${event.params.alertId}`);
  
  const snapshot = event.data;
  if (!snapshot) {
    console.error(`[Error] No snapshot data found for alert: ${event.params.alertId}`);
    return;
  }

  const data = snapshot.data();
  console.log(`🚨 SOS Alert Received from ${data.userId}: ${data.reason}`);

  try {
    // 1. Create a security dispatch log entry
    const logRef = admin.firestore().collection("security_dispatch_logs").doc();
    await logRef.set({
      alertId: event.params.alertId,
      userId: data.userId,
      userEmail: data.userEmail,
      reason: data.reason,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "dispatched",
      location: "Gate 2 Area" 
    });
    console.log(`[Success] Security dispatch log created: ${logRef.id}`);
  } catch (err) {
    console.error(`[Error] Failed to create security dispatch log:`, err);
  }

  return { success: true };
});

/**
 * Trigger: When any zone density updates
 * Explicitly setting region to us-central1
 */
exports.aggregatestadiumstats = onDocumentUpdated({
  document: "zones/{zoneId}",
  region: "us-central1"
}, async (event) => {
  console.log(`[Trigger] aggregatestadiumstats fired for zone: ${event.params.zoneId}`);

  const snapshot = event.data;
  if (!snapshot) {
    console.error(`[Error] No data found for zone: ${event.params.zoneId}`);
    return;
  }

  try {
    // Fetch all zones to calculate total occupancy
    const zonesSnapshot = await admin.firestore().collection("zones").get();
    let totalDensity = 0;
    let count = 0;
    let congestedZones = [];

    zonesSnapshot.forEach(doc => {
      const data = doc.data();
      totalDensity += data.density || 0;
      count++;
      if (data.status === "congested") {
        congestedZones.push(data.name);
      }
    });

    const avgDensity = count > 0 ? Math.round(totalDensity / count) : 0;
    const status = avgDensity > 80 ? "congested" : avgDensity > 50 ? "moderate" : "clear";

    // Identify safest exit gate
    const gatesSnapshot = await admin.firestore().collection("zones").where("type", "==", "gate").get();
    let safestGate = "Main Gate";
    let minDensity = 101;

    gatesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.density < minDensity) {
        minDensity = data.density;
        safestGate = data.name;
      }
    });

    // Update global stadium status document
    const statusRef = admin.firestore().collection("stadium_status").doc("current");
    await statusRef.set({
      averageDensity: avgDensity,
      overallStatus: status,
      congestedZones,
      safestGate,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`📊 Stadium stats aggregated. Avg Density: ${avgDensity}% | Safest Gate: ${safestGate}`);
  } catch (err) {
    console.error(`[Error] Failed to aggregate stadium stats:`, err);
  }

  return { success: true };
});
