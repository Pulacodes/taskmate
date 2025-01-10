import clientPromise from "../../../../lib/mongodb";


export async function GET(request, { params }) {
  const { userid } = params;

  try {
    // Validate userid
    if (!userid || typeof userid !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    // Fetch only the `reviews` field
    const user = await db.collection("users").findOne(
      { email: new RegExp(`^${userid}$`, "i") },
      { projection: { reviews: 1 } } // Include only the `reviews` field
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user.reviews || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
