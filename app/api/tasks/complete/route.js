import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const tasksCollection = db.collection("tasks");

    // Fetch the task details including requirements and price
    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task status to "complete"
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { status: "complete" } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Task was not updated" }, { status: 500 });
    }

    // Return updated task details
    return NextResponse.json({
      message: "Task marked as complete, awaiting evaluation from creator",
      task: {
        requirements: task.requirements || [],
        price: task.price || 0,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
