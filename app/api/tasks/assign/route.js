import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { taskId, assignedUser, email, paymentMethod, address, requirements, taskType, location } = await req.json();

    if (!taskId || !assignedUser) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
   const db = client.db('taskme');
    const tasksCollection = db.collection("tasks");

    // Update the task with new assignment details
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          AssignedTo: email,
          paymentMethod,
          address: paymentMethod === "cash" ? address : "",
          requirements,
          taskType,
          location: taskType === "physical" ? location : "",
          status: "assigned",
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Task not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
