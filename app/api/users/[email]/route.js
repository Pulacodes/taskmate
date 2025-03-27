import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function GET(request, { params }) {
  const { email } = params;

  try {
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const user = await db.collection("users").findOne({ 
      email: new RegExp(`^${email}$`, "i") 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { email } = params;

  try {
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    const formData = await request.formData();

    // Group all form data entries by field name
    const fields = {};
    for (const [fieldName, fieldValue] of formData.entries()) {
      if (!fields[fieldName]) {
        fields[fieldName] = [];
      }
      fields[fieldName].push(fieldValue);
    }

    const setFields = {};
    const pushOperations = {};

    // Process each field
    for (const [fieldName, values] of Object.entries(fields)) {
      const isFileField = values.some(value => value instanceof File);

      if (isFileField) {
        // Process file uploads
        const files = values.filter(value => value instanceof File);
        const urls = await Promise.all(files.map(file => handleFileUpload(file)));

        if (fieldName === 'avatarUrl') {
          // Single file - set the field value
          setFields[fieldName] = urls[0];
        } else if (fieldName === 'portfolioImages') {
          // Multiple files - push to array
          pushOperations[fieldName] = { $each: urls };
        }
      } else {
        // Handle text fields - use first value
        setFields[fieldName] = values[0];
      }
    }

    // Build update document
    const updateDocument = {};
    if (Object.keys(setFields).length > 0) {
      updateDocument.$set = setFields;
    }
    if (Object.keys(pushOperations).length > 0) {
      updateDocument.$push = pushOperations;
    }

    if (Object.keys(updateDocument).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await db.collection("users").findOneAndUpdate(
      { email: new RegExp(`^${email}$`, "i") },
      updateDocument,
      { returnDocument: "after" }
    );

    if (!updatedUser.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser.value, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleFileUpload(file) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
}