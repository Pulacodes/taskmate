import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  const { username, email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db('taskme');
  const usersCollection = db.collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // Hash password and add new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username,email, password: hashedPassword };
  const result = await usersCollection.insertOne(newUser);

  return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId });
}


