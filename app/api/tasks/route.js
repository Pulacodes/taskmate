import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    // Get the logged-in user's ID
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from Clerk
    const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, // Use Clerk Secret Key
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch user details." }, { status: 500 });
    }

    const user = await userResponse.json();

    // Parse request body
    const { title, content, price, status, category,location,taskType, duedate } = await req.json();
    if (!title || !content || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Prepare new task object
    const newTask = {
      title,
      content,
      category,
      price: parseFloat(price),
      status: status || 'Available',
      requirements: null,
      location,
      paymentMethod: null,
      taskType,
      duedate,
      AssignedTo:null,
      createdAt: new Date(),
      user: {
        username: user.username || `${user.first_name} ${user.last_name}`,
        email: user.email_addresses?.[0]?.email_address,
        avatar: user.profile_image_url,
      },
    };

    // Insert task into database
    const result = await collection.insertOne(newTask);
    if (!result.acknowledged) {
      throw new Error("Failed to insert task");
    }

    // Return the newly created task
    const insertedTask = {
      ...newTask,
      _id: result.insertedId,
    };
    return NextResponse.json(insertedTask, { status: 201 });

  } catch (error) {
    console.error("Error inserting task:", error);
    return NextResponse.json({ message: "Failed to add task" }, { status: 500 });
  }
}
