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

    // Process text fields
    const username = formData.get('username');
    const aboutMe = formData.get('aboutMe');
    const profession = formData.get('profession');
    const cvUrl = formData.get('cvUrl');

    // Process files
    const avatarFile = formData.get('avatar');
    const portfolioFiles = formData.getAll('portfolioImages');

    const updateDocument = {};
    const setFields = {};

    // Handle avatar upload
    if (avatarFile && avatarFile.size > 0) {
      const avatarUrl = await handleFileUpload(avatarFile);
      setFields.avatarUrl = avatarUrl;
    }

    // Handle portfolio images
    if (portfolioFiles.length > 0) {
      const portfolioUrls = await Promise.all(
        portfolioFiles.map(file => handleFileUpload(file))
      );
      updateDocument.$push = { 
        portfolioImages: { $each: portfolioUrls } 
      };
    }

    // Add text fields to setFields
    if (username) setFields.username = username;
    if (aboutMe) setFields.aboutMe = aboutMe;
    if (profession) setFields.profession = profession;
    if (cvUrl) setFields.cvUrl = cvUrl;

    // Add setFields to update document if any
    if (Object.keys(setFields).length > 0) {
      updateDocument.$set = setFields;
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