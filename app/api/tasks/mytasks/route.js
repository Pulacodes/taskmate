import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "../../../../lib/mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const userId = session.user.email;

  try {
    const db = await connectToDatabase();
    const tasks = await db.collection("tasks").find({ acceptedBy: userId }).toArray();

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}
