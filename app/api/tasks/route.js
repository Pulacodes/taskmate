import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getAuth } from "@clerk/nextjs/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs';

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
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch user details." }, { status: 500 });
    }

    const user = await userResponse.json();

    // Parse form data
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const price = formData.get("price");
    const status = formData.get("status") || "Available";
    const category = formData.get("category");
    const location = formData.get("location");
    const taskType = formData.get("taskType");
    const duedate = formData.get("duedate");

    if (!title || !content || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Handle file uploads
    const files = formData.getAll("files"); // Get all uploaded files
    const fileUrls = [];

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Ensure the upload directory exists
      await new Promise((resolve) => mkdir(uploadDir, { recursive: true }, resolve));

      for (const file of files) {
        if (file.name && file.size > 0) {
          const filePath = path.join(uploadDir, file.name);
          await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
          fileUrls.push(`/uploads/${file.name}`);
        }
      }
    }

    // Prepare new task object
    const newTask = {
      title,
      content,
      category,
      price: parseFloat(price),
      status,
      location,
      taskType,
      duedate,
      AssignedTo: null,
      createdAt: new Date(),
      files: fileUrls, // Store file URLs in DB
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
