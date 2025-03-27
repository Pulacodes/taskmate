import clientPromise from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { taskid } = params;

  // Validate the task ID as a string
  if (!ObjectId.isValid(taskid)) {
    return NextResponse.json({ message: 'Invalid task ID format' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    const task = await collection.findOne({ _id: new ObjectId(taskid) }); // Pass string to ObjectId

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ message: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const { taskid } = params;

  // Validate the task ID as a string
  if (!ObjectId.isValid(taskid)) {
    return NextResponse.json({ message: 'Invalid task ID format' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('taskme');
  const collection = db.collection('tasks');

  try {
    const offerData = await req.json();

    // Validate the offer data
    if (!offerData || !offerData.userId || !offerData.amount || typeof offerData.amount !== 'number') {
      return NextResponse.json({ message: 'Invalid offer data' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(taskid) }, // Pass string to ObjectId
      {
        $push: {
          offers: {
            userId: offerData.userId,
            avatar: offerData.avatar,
            name: offerData.name,
            amount: offerData.amount,
            message: offerData.message || '',
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Offer added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding offer:', error);
    return NextResponse.json({ message: 'Failed to add offer' }, { status: 500 });
  }
}
