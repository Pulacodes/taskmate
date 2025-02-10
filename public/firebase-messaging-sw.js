importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD0NxZO94IUk6EB0DI0LJjvF6AaAWXXkaI",
  authDomain: "taskmate-e7245.firebaseapp.com",
  projectId: "taskmate-e7245",
  storageBucket: "taskmate-e7245.appspot.com",
  messagingSenderId: "390551867234",
  appId: "1:390551867234:web:f2fd36bb293c8157ef663b",
  measurementId: "G-VG1CPWZ0SR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || "/favicon.ico",
  });
});
