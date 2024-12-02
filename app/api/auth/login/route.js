import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  const { email, password } = await req.json();
  
  const client = await clientPromise;
  const db = client.db('taskme');
  const usersCollection = db.collection('users');

  // Check if user exists
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Respond with user data (excluding password)
  return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
}
