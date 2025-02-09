// lib/requestPermission.js
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BGvNMIRTDKwtYyJLcgNnfSaqYVvZ1lZ5KM8_bBdy5aycZEk11eUTX676YabPOqssEJtE_BpgNSUrtpVJp5FmcB4",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.error("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};
