import clientPromise  from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const { userId, token } = await req.json();

    if (!userId || !token) {
      return Response.json({ error: "Missing userId or token" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");

    // Update the user document with the FCM token
    const result = await db.collection("users").updateOne(
      { userId: userId }, // Find the user by ID
      { $set: { fcmToken: token } }, // Update/add the FCM token
      { upsert: true } // Create the document if it doesn't exist
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return Response.json({ error: "Failed to update FCM token" }, { status: 500 });
    }

    return Response.json({ message: "Token saved successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error saving token:", error);
    return Response.json({ error: "Error saving token" }, { status: 500 });
  }
}
