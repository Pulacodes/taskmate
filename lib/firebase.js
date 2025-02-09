// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0NxZO94IUk6EB0DI0LJjvF6AaAWXXkaI",
  authDomain: "taskmate-e7245.firebaseapp.com",
  projectId: "taskmate-e7245",
  storageBucket: "taskmate-e7245.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "390551867234",
  appId: "1:390551867234:web:f2fd36bb293c8157ef663b",
  measurementId: "G-VG1CPWZ0SR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app); // Initialize analytics (optional)
const messaging = getMessaging(app); // Initialize messaging

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});

// Export messaging functions
export { messaging, getToken, onMessage };
