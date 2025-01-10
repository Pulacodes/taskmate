import clientPromise from "../../../../lib/mongodb";

export async function GET(request, { params }) {
  const { email } = params;

  try {
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const user = await db.collection("users").findOne({ email: new RegExp(`^${email}$`, "i") });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
