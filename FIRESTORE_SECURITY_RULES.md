# Recommended Firestore Security Rules

To secure your Zentry application, you should apply these rules in the **Rules** tab of your Firestore Database in the Firebase Console.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection rules
    match /users/{userId} {
      // Users can read their own profile
      // Admins can read any user profile
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Users can only create their own profile
      // Only admins can update the 'role' field
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        request.auth.uid == userId && 
        (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']))
        || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // General rule for other collections (if you add them later)
    // For now, deny everything else by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Promote a User to Admin
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Firestore Database**.
3. Select the `users` collection.
4. Locate the document corresponding to the User ID (UID) you want to promote.
5. Edit the `role` field and change it from `"user"` to `"admin"`.
6. Save the changes.
7. The user will need to refresh their application to see the Admin features.
