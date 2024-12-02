import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    // Get the user ID from the JWT token
    const token = await getToken({ req });
    if (!token || !token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id;

    const { title, content, price, status } = await req.json();
    const newTask = { 
      title, 
      content, 
      price: parseFloat(price), // Ensure price is a float
      status: status || 'Pending', // Default status if not provided
      createdBy: userId, 
      acceptedBy: null,  
      createdAt: new Date() 
    };

    const result = await collection.insertOne(newTask);
    return NextResponse.json(result.ops[0], { status: 201 });
  } catch (error) {
    console.error("Error inserting task:", error);
    return NextResponse.json({ message: "Failed to add task" }, { status: 500 });
  }
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    const tasks = await collection.find({}).toArray();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function acceptTask(req) {
  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');
  const { taskId } = await req.json();

  try {
    // Get the user ID from the JWT token
    const token = await getToken({ req });
    if (!token || !token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id;

    // Update the task's `acceptedBy` field with the user's ID
    const result = await collection.updateOne(
      { _id: new ObjectId(taskId), acceptedBy: null }, // Find the task by its ID
      { $set: { acceptedBy: userId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Task not found or already accepted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task accepted successfully' });
  } catch (error) {
    console.error("Error accepting task:", error);
    return NextResponse.json({ message: "Failed to accept task" }, { status: 500 });
  }
}
