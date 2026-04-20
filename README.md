# Zentry: Smart Event Experience 🏟️✨

**Zentry** is a high-fidelity, mobile-first Smart Crowd Management application designed for large-scale stadiums and major events. It transforms the attendee experience through real-time AI intelligence, interactive engagement, and safety-first navigation.

---

## 🎯 Chosen Vertical: Smart Event/Stadium Management
Zentry targets the **High-Density Event** sector. Modern stadiums (like M.A. Chidambaram Stadium in Chennai) face critical challenges during peak hours: extreme congestion, safety risks (stampedes/fires), and poor information flow for attendees. Zentry acts as a digital "Live Companion" to solve these at scale.

## 🧠 Approach & Logic

### 1. Mobile-First Edge Design
The application is built within a **420px mobile container** constraint, reflecting the reality that 99% of stadium interactions happen on a smartphone while the fan is in their seat or moving through concourses.

### 2. AI-Driven Intent Parsing
Instead of standard search bars, Zentry uses the **Gemini AI Engine** to parse user requests. 
- **Logic**: The assistant detects keywords (Food, Exit, Seats) and current context (checked-in status) to trigger **UI actions**. 
- **Actionable AI**: If a user asks "I'm hungry," the AI doesn't just list stalls; it triggers a deep-link to the `QueueManager` with real-time wait times.

### 3. Real-Time State Architecture
The system relies on a **Centralized Live Event State**:
- **Density Monitoring**: Simulates IoT sensor data to provide a dynamic heatmap.
- **Synchronized Emergencies**: A global emergency state ensures that if an Admin triggers a fire evacuation, the entire UI across thousands of devices instantly switches to "Crisis Mode" with evacuation routes.

## 🛠️ How the Solution Works

1.  **Identity & Security**: Secure authentication via **Firebase Auth** (Google & Email). Role-Based Access Control (RBAC) ensures only authorized staff see management tools.
2.  **The "Live Loop"**:
    - **Check-In**: Users scan their ticket (animated QR flow) to unlock the live dashboard.
    - **Monitor**: The Heatmap provides a visual overview of stadium congestion.
    - **Interact**: The Community Feed and Polls keep fans engaged during intervals.
3.  **Emergency Management (SOS)**:
    - **User-Side**: 1-tap reporting for Medical, Security, or Fire.
    - **System-Side**: Instantly triggers a global alert banner and updates local security logs.
    - **AI Dispatch**: Simulates the dispatch of personnel with real-time ETA tracking.

## 📌 Technical Assumptions

- **Connectivity**: Assumes the venue has robust 5G or Stadium-wide Wi-Fi (standard for modern 'Smart Stadiums').
- **Positioning**: Assumes active GPS for outdoor navigation and relies on defined "Seat Zones" for indoor navigation.
- **IoT Integration**: The solution assumes a middleware (simulated in this project via `stadiumService.js`) that pipes real-time density data from gate sensors.

---

## 🚀 Key Features

### 1. 🤖 AI Virtual Assistant
- **Multilingual Support**: Fully functional in **English, Tamil, and Hindi**.
- **Deep-Linking**: Direct navigation to "Nearest Exit," "Shortest Food Queue," or "Restrooms."

### 2. 📊 Smart Crowd Heatmap + Satellite View
- **Density States**: Clear, Moderate, and Congested zones updated in real-time.
- **Google Maps Satellite Overlay**: Toggle between SVG schematic and live satellite view of M.A. Chidambaram Stadium.
- **Live Density Markers**: Pulsating `OverlayView` markers on the satellite map showing zone-wise crowd density percentages.
- **Contextual Indicators**: Seat location, user position ("You"), exit gates, and emergency markers render on both views.

### 3. 🎸 Interactive Fan Engagement
- **Live Audience Polls**: Animated feedback loops for real-time engagement.
- **Community Feed**: A social heart for the stadium.

### 4. 🚨 Emergency SOS Portal
- **Global Status Banner**: Visible across all tabs during emergencies.
- **AI Dispatch**: Automatic security response simulation.

### 5. 🍕 Food & Beverage Ordering
- **Live Queue Times**: Real-time wait estimates for food stalls across concourses.
- **Order Flow**: Browse menu → place order → track preparation with animated status.
- **Smart Routing**: AI assistant directs fans to the shortest food queue.

### 6. 🅿️ Smart Parking Manager
- **Real-Time Lot Status**: Color-coded parking zone availability.
- **Booking System**: Reserve spots with confirmation flow.
- **Navigation**: Direct deep-link to parking location.

### 7. 🔔 Notification Center
- **Multi-Category Alerts**: SOS updates, event announcements, crowd advisories.
- **Priority Indicators**: Urgency-coded notifications with timestamps.

### 8. 🚪 Exit Scheduler
- **Staggered Exit**: Phase-based crowd dispersal to prevent stampedes.
- **Gate Assignments**: Personalized exit gates with estimated clear times.

### 9. 🔐 Authentication & RBAC
- **Firebase Auth**: Email/password and **Google Sign-In** (OAuth 2.0).
- **Role-Based Access**: Admin-only controls for emergency triggers, data seeding, and simulations.

## 🏗️ Technical Implementation & Logic Flows

### 1. AI Assistant Intent-Action Flow
Zentry doesn't just "chat"; it command-and-controls the UI based on natural language.
- **The Flow**: 
    1.  User submits a query (e.g., "Where is the nearest exit?").
    2.  `StadiumAssistant.jsx` sends the query to our AI parsing engine.
    3.  The engine returns an **Intent Object** (e.g., `{ action: 'navigation', target: 'Gate 2' }`).
    4.  The frontend maps this to a direct Google Maps deep-link or a UI tab switch.
- **Implementation**: Uses a robust keyword-intent mapping combined with Google Gemini for context-aware parsing.

### 2. Google Maps Satellite Integration
Real-time crowd density visualization over actual satellite imagery.
- **The Flow**:
    1.  `HeatMap.jsx` initializes the Google Maps JS API via `useJsApiLoader` with `@react-google-maps/api`.
    2.  SVG coordinate space (0–800) is mapped to GPS coordinates using linear transformation: `svgToGps(x, y)`.
    3.  Zone density data from Firestore (`StadiumContext`) is rendered as `OverlayView` pulse markers on the satellite map.
    4.  Markers dynamically change color (green → yellow → red), pulse speed, and size based on real-time density percentages.
- **Key Constants**:
    - Stadium Center: `13.0627°N, 80.2794°E` (M.A. Chidambaram Stadium, Chennai)
    - Scale: `SCALE_LAT = 0.0000022`, `SCALE_LNG = 0.0000024` (~200m stadium diameter)
- **Implementation**: Uses `GoogleMap` component with `satellite` mapTypeId, custom `OverlayView` markers, and CSS `@keyframes densityPulse` animation.

### 3. SOS Emergency Lifecycle
A mission-critical flow that synchronizes the stadium during a crisis.
- **The Flow**:
    1.  **Trigger**: User taps "Medical SOS" in the emergency portal.
    2.  **Signal**: A document is written to the `sos_alerts` collection in Firestore.
    3.  **Background Processing**: A **Cloud Function** (`onsostrigger`) detects the new alert.
    4.  **Escalation**: The function creates a secondary `security_dispatch_log` and updates the `stadium_status` global state.
    5.  **Global Feedback**: All active devices listen to the `stadium_status` change, triggering the red **Global Emergency Banner** across the app.
- **Implementation**: Firebase Cloud Functions (v2) handle the escalation logic to keep client-side code lightweight.

### 4. Real-Time Crowd Density Lifecycle
- **The Flow**:
    1.  **Data Ingestion**: Simulated gate-entry sensors pipe density values (0-100) into Firestore.
    2.  **Context Propagation**: `StadiumContext.jsx` subscribes to these updates via `onSnapshot`.
    3.  **Visual Render**: The `HeatMap.jsx` component receives the raw data and translates it into dynamic HSL color values and CSS-pulsing animations on both SVG and satellite views.
- **Implementation**: Uses Firestore's real-time listeners for sub-second synchronization across the attendee pool.

### 5. Role-Based Access Flow (RBAC)
- **The Flow**:
    1.  **Auth**: User logs in; Firestore `users` document is fetched.
    2.  **Logic**: `AuthContext.jsx` checks for a `role: 'admin'` attribute.
    3.  **UI Switch**: Conditional rendering in `App.jsx` reveals the "Admin Security Panel" only if the role is verified.
- **Implementation**: Secured by **Firestore Security Rules** which prevent non-admins from manually changing their own role attribute.

---

## 🛠️ The Four Pillars of Zentry

### 🛡️ 1. Security & Data Integrity
Zentry implements a defense-in-depth strategy to protect stadium data and fan safety:
- **Role-Based Access Control (RBAC)**: Critial stadium operations (like Fire Evacuations) are strictly bound to Admin accounts.
- **Firestore Security Rules**: User PII is isolated; accounts can only read/write their own profiles.
- **Verified SOS Audit**: Every emergency trigger is logged with a permanent timestamp and User ID for legal and operational review.

### ⚡ 2. Efficiency & Performance
Designed for high-density environments where every second counts:
- **Cloud-Offloaded Processing**: Stadium-wide statistics and SOS dispatch logic are handled by Cloud Functions, keeping the mobile interface fluid and responsive.
- **Dynamic Queue Optimization**: Reduces concourse congestion by directing fans to facilities with minimal wait times via real-time logic.
- **Battery-Conscious Intelligence**: Uses targeted animations and lightweight logic to ensure the app survives the full duration of a match or event.

### ♿ 3. Universal Accessibility
Zentry is built to be usable by every fan in the stadium:
- **Full ARIA Compliance**: 100% of the UI is synchronized with screen-reader accessible roles and aria-labels, verified by our automated test suite.
- **Multilingual AI Assistant**: Features native support for **English, Tamil, and Hindi** to break down language barriers.
- **Semantic Interaction**: High-contrast designs and large interactive touch targets optimized for one-handed use in crowded stands.

### 🌐 4. Google Services Ecosystem
Zentry leverages the best of Google's cloud and AI technology:
- **Firebase Platform**: Provides the real-time backbone (Firestore), secure identity (Auth), and serverless logic (Functions).
- **Google Maps JavaScript API**: Powers the satellite heatmap overlay with real-time `OverlayView` density markers and contextual gate/user indicators.
- **Gemini (Google AI)**: Powers the conversational intelligence that translates attendee questions into actionable UI commands.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 (Vite 5) |
| **Backend** | Firebase (Auth, Firestore, Cloud Functions v2) |
| **Maps** | Google Maps JavaScript API (`@react-google-maps/api`) |
| **AI** | Google Gemini (`@google/generative-ai`) |
| **Icons** | Lucide React, Material Design Icons |
| **Styling** | Vanilla CSS (Glassmorphism Design System) |
| **Testing** | Vitest, React Testing Library |
| **Deployment** | Google Cloud Build → Cloud Run (Dockerized Nginx) |

---

## 🏁 Getting Started
1. Clone the repository.
2. Setup `.env` with the following keys:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_GOOGLE_MAPS_API_KEY=your_maps_key
   ```
3. Run `npm install` and `npm run dev`.
4. Run `npx vitest run` to verify the **26-test stabilization suite**.

---

## 🔑 Demo Credentials

| Email | Password | Role | Access |
|---|---|---|---|
| `test3@gmail.com` | `123456` | **Admin** | Full access: Emergency controls, Simulation, Data Seeding |
| `test2@gmail.com` | `123456` | **User** | Standard attendee: Heatmap, Food, SOS, Navigation |

> **Note**: Admin accounts have access to the **Admin Security Panel** (Settings → Admin Controls) for triggering emergencies, running live crowd simulations, and seeding stadium data.

---

## 🚀 Deployment Pipeline

```
.env → deploy.sh → cloudbuild.yaml → Dockerfile → Cloud Run
```

| Step | Tool | Purpose |
|---|---|---|
| **1. Build** | Google Cloud Build | Docker image with Vite build (env vars injected as build args) |
| **2. Registry** | Google Container Registry | `gcr.io/pw-2006/zentry` |
| **3. Serve** | Google Cloud Run | Nginx serving static assets with auto-scaling |

Deploy with: `sh deploy.sh`

---

## 🌐 Live Deployment
**Production URL**: [https://zentry-331594691149.us-central1.run.app](https://zentry-331594691149.us-central1.run.app)

*Built for the future of live experiences.*

