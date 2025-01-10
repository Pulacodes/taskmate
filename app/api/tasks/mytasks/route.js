import { getAuth } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../lib/mongodb";

export async function GET() {
 
  const { userId } = getAuth(req);
  if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, // Use Clerk Secret Key
            },
          });
      
          if (!userResponse.ok) {
            return NextResponse.json({ message: "Failed to fetch user details." }, { status: 500 });
          }
      
          const user = await userResponse.json();

  try {
    const db = await connectToDatabase();
    const tasks = await db.collection("tasks").find({ acceptedBy: user.email_addresses?.[0]?.email_address }).toArray();

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
