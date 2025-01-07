import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { getToken } from 'next-auth/jwt';

export async function GET() {
    const client = await clientPromise;
    const db = client.db('taskme');
    const collection = db.collection('tasks');
  
    try {
      const tasks = await collection.find({}).toArray();
      return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
    }
  }