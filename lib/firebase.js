// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0NxZO94IUk6EB0DI0LJjvF6AaAWXXkaI",
  authDomain: "taskmate-e7245.firebaseapp.com",
  projectId: "taskmate-e7245",
  storageBucket: "taskmate-e7245.appspot.com",
  messagingSenderId: "390551867234",
  appId: "1:390551867234:web:f2fd36bb293c8157ef663b",
  measurementId: "G-VG1CPWZ0SR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Initialize Analytics only if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.warn("Firebase Analytics is not supported in this environment.");
  }
});

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});

// Export Firebase services
export { messaging, getToken, onMessage, analytics };
