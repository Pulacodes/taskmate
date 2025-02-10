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
      
            
      
            // Send FCM token and userId to your backend API
            await fetch("/api/save-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: "user_2rUQX5s7RrdH30FcovNwjfwIBZb", token }),
            });
      
            console.log("FCM Token saved successfully.");
          } else {
            console.error("Permission not granted for notifications.");
          }
        } catch (error) {
          console.error("Error getting FCM token:", error);
        }
      };
      