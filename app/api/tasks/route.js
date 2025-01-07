import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    // Extract token from cookies
    console.log("Incoming Request Headers:", req.headers.get("cookie")); // Log cookies
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Decoded Token:", token); // Log decoded token
  
  if (!token || !token.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.email;

    // Parse request body
    const { title, content, price, status, category, duedate } = await req.json();
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
      createdBy: userId, 
      assignedTo: null,  
      duedate,
      createdAt: new Date(),
    };

    // Insert task into database
const result = await collection.insertOne(newTask);
if (!result.acknowledged) {
  throw new Error("Failed to insert task");
}

// Return the newly created task (if needed, you can fetch it back)
const insertedTask = {
  ...newTask,
  _id: result.insertedId, // Add the inserted document's ID to the response
};
return NextResponse.json(insertedTask, { status: 201 });

  } catch (error) {
    console.error("Error inserting task:", error);
    return NextResponse.json({ message: "Failed to add task" }, { status: 500 });
  }
}
