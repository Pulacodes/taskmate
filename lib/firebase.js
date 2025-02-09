// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0NxZO94IUk6EB0DI0LJjvF6AaAWXXkaI",
  authDomain: "taskmate-e7245.firebaseapp.com",
  projectId: "taskmate-e7245",
  storageBucket: "taskmate-e7245.firebasestorage.app",
  messagingSenderId: "390551867234",
  appId: "1:390551867234:web:f2fd36bb293c8157ef663b",
  measurementId: "G-VG1CPWZ0SR"
};
onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    // Show notification
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon,
    });
  });
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
export { messaging, getToken, onMessage };