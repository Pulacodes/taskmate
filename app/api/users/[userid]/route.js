import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  const { userid } = params;

  try {
    // Validate userid
    if (!ObjectId.isValid(userid)) {
      return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userid) });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
