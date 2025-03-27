import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();

    // Extract fields from form data
    const taskId = formData.get("taskId");
    const amount = formData.get("amount");
    const assignedUser = formData.get("assignedUser");
    const taskType = formData.get("taskType");
    const personalInfo = JSON.parse(formData.get("personalInfo"));
    const address = JSON.parse(formData.get("address"));
    const requirements = JSON.parse(formData.get("requirements"));
    const files = formData.getAll("files");

    // Validate required fields
    if (!taskId || !taskType || !personalInfo || !requirements) {
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

    // Handle file uploads (store files locally for demonstration purposes)
    const fileReferences = [];
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      // Save file to the "public/uploads" directory
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));

      // Store file reference
      fileReferences.push({
        name: file.name,
        path: `/uploads/${fileName}`,
      });
    }

    // Prepare update data
    const updateData = {
      taskType,
      AssignedTo: assignedUser,
      personalInfo,
      requirements,
      amount,
      status: "assigned",
      files: fileReferences, // Store file references
    };

    // Add address if task type is physical
    if (taskType === "physical") {
      updateData.address = address;
    }

    // Update the task in MongoDB
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