import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData(); // Accept FormData instead of JSON

    const taskId = formData.get("taskId"); // Extract task ID
    const imageFile = formData.get("image"); // Extract file (if provided)

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const tasksCollection = db.collection("tasks");

    // Fetch the task details
    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    let imageUrl = null;

    if (imageFile) {
      const fileBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      // Save file
      const filePath = path.join(uploadDir, imageFile.name);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${imageFile.name}`;
    }

    // Update the task status and attach the uploaded image (if any)
    const updateFields = { status: "complete" };
    if (imageUrl) {
      updateFields.image = imageUrl;
    }

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: updateFields }
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
        image: imageUrl,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
