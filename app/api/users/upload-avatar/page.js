import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;

    // Handle file upload logic here (e.g., using formidable)
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

    // Update avatarUrl in MongoDB
    await db.collection('users').updateOne(
      { email },
      { $set: { avatarUrl: newAvatarUrl } }
    );

    res.status(200).json({ avatarUrl: newAvatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}