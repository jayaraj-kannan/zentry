# Zentry: Smart Event Experience 🏟️✨

**Zentry** is a high-fidelity, mobile-first Smart Crowd Management application designed for large-scale stadiums and events (like M.A. Chidambaram Stadium). It transforms the attendee experience through real-time AI intelligence, interactive engagement, and safety-first navigation.

---

## 🚀 Key Features

### 1. 🤖 AI Virtual Assistant
- **Floating Intelligence**: A persistent, pulsing AI assistant accessible from any screen.
- **Multilingual Support**: Fully functional in **English, Tamil, and Hindi**.
- **Actionable Responses**: Doesn't just answer; it acts. Trigger Google Maps navigation directly from chat bubbles for "Nearest Exit," "Shortest Food Queue," or "Restrooms."

### 2. 📊 Smart Crowd Heatmap
- **Real-time Monitoring**: Visualizes stadium density across different zones (North Stand, Pavillion, etc.).
- **Live State Changes**: Dynamically updates as crowd flow shifts, providing users with a "Live Status" of the event.

### 3. 🎸 Interactive Fan Engagement
- **Live Audience Polls**: Influence the event in real-time (e.g., voting for the next DJ song).
- **Community Feed**: A social heart for the stadium where fans can ask questions, post comments, and see official announcements.
- **Percentage Tracking**: Real-time visual feedback on poll results with animated progress bars.

### 4. 🚗 Personalized Parking & AI Exit
- **"Your Vehicle" Hub**: Post-check-in tracking of your specific parking lot (e.g., Premium Lot B).
- **Exit Estimation**: Uses stadium density sensors to calculate an "Estimated Time to Vehicle" and current exit flow status (Smooth, Moderate, or Delayed).
- **Direct Routing**: One-tap navigation back to your car.

### 5. 🎟️ Ticket Experience
- **Zero-Scroll Design**: A physically-inspired, horizontal ticket pass with "bite-cut" notches.
- **Locate My Seat**: Integrated AR-style navigation to bring you exactly to your stand and seat coordinates.
- **Verified Status**: Secure check-in with a verified badge and entry gate maps.

### 6. 🚨 Emergency SOS Portal
- **One-Tap Reporting**: Dedicated fast-action menu for Medical, Security, Fire, and Harassment alerts.
- **AI Dispatch**: Simulates immediate security response with ETA tracking and persistent management.

### 7. 🔐 Secure Authentication (Firebase)
- **Multi-Provider Login**: Supports Email/Password and **Google One-Tap** authentication.
- **Glassmorphic Auth UI**: A premium, animated login and signup experience with real-time validation.
- **Global Auth State**: Seemless session management using React Context and Firebase SDK.

### 8. 🛡️ Role-Based Access Control (RBAC)
- **Admin vs. User**: Granular permissions system powered by Firestore.
- **Restricted Controls**: Stadium-wide emergency triggers and advanced management tools are strictly reserved for **Admins**.
- **Dynamic UI**: The interface adapts based on the user's role, hiding or revealing management icons as needed.

### 9. 👤 Extended User Profiles
- **Comprehensive Details**: Users can store and update their phone number, address, and seat details.
- **Emergency Contacts**: Dedicated fields for saving critical contact information for stadium safety.
- **Data Persistence**: All profile metadata is synchronized in real-time with Cloud Firestore.

### 10. 🔔 Persistent Smart Alerts
- **Top-Down Notifications**: High-visibility alerts positioned at the top of the app.
- **Persistence Logic**: Alerts stay visible until manually dismissed, ensuring critical event updates are never missed.

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite)
- **Backend-as-a-Service**: Firebase (Authentication & Cloud Firestore)
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide React & Material Design Icons (MDI)
- **Typography**: Outfit (Google Fonts)
- **Animations**: CSS Keyframes & Framer-like transitions

---

## 📱 Design Philosophy
Zentry follows a **Premium Dark Mode** aesthetic, utilizing:
- **Glassmorphism**: Blurred backdrops and semi-transparent layers.
- **Vibrant Gradients**: Cyan and Purple brand colors (`#00c6ff` to `#7b2ff7`).
- **Mobile-First UX**: Optimized for one-handed use with a 420px container and safe-area padding.

---

## 🏁 Getting Started
1. Clone the repository.
2. **Environment Setup**: Create a `.env` file in the root and add your configuration variables:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # AI Configuration (Optional but recommended)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
3. Run `npm install`.
4. Start the development server with `npm run dev`.
5. **Initial Setup**: To test admin features, manually promote your user UID to `admin` in the Firestore `users` collection.

---

## 🛡️ Security Rules
The application uses Firestore Security Rules to protect user data:
- Users can only read/write their **own** profile documents.
- Only **Admins** can modify the `role` field in the database.
- See `FIRESTORE_SECURITY_RULES.md` for the recommended configuration.

---

*Built for the future of live experiences.*
