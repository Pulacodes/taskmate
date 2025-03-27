import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;

    const updateData = {};
    const fields = ['username', 'aboutMe', 'profession', 'cvUrl'];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const result = await db.collection('users').updateOne(
      { email },
      { $set: updateData },
      { upsert: true }
    );

    const updatedUser = await db.collection('users').findOne({ email });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}