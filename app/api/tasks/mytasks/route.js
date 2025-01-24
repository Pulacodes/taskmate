import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { userId } = getAuth(req);
  const client = await clientPromise;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
 
  // Fetch user details from Clerk API
  const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  if (!userResponse.ok) {
    return NextResponse.json({ message: "Failed to fetch user details." }, { status: 500 });
  }

  const user = await userResponse.json();
  const userEmail = user.email_addresses?.[0]?.email_address;

  if (!userEmail) {
    return NextResponse.json({ message: "User email not found." }, { status: 400 });
  }

  // Connect to the database
  const db = client.db('taskme');
  const tasks = await db.collection("tasks").find({
    $or: [
      { AssignedTo: userEmail },
      {"user.email": userEmail }
    ]
  }).toArray();
 console.log(tasks);
  return new Response(JSON.stringify(tasks), { status: 200 });
}
