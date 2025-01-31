import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { taskId, assignedUser, email, paymentMethod, address, requirements, taskType, location } = await req.json();

    // Validate required fields
    if (!taskId || !assignedUser || !email || !paymentMethod || !requirements || !taskType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate taskId
    if (!ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("taskme");
    const tasksCollection = db.collection("tasks");

    // Prepare update data
    const updateData = {
      AssignedTo: email,
      paymentMethod,
      requirements,
      taskType,
      status: "assigned",
    };

    // Add conditional fields
    if (paymentMethod === "cash") {
      updateData.address = address;
    }

    if (taskType === "physical") {
      updateData.location = location;
    }

    // Update the task
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: updateData }
    );

    // Check if the task was updated
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Task not found or update failed" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: "Task assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning task:", error.message || error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}