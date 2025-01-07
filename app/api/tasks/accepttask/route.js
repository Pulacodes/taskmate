import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getToken } from 'next-auth/jwt';

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