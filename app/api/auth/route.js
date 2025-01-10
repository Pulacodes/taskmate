import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "No user is signed in." }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db('taskme');
  const usersCollection = db.collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email: user.email_addresses?.[0]?.email_address });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // Fetch user details from Clerk using userId
  const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, // Use the correct API key
    },
  });

  if (!userResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch user details from Clerk." }, { status: 500 });
  }

  const user = await userResponse.json();

  // Create a new user with data from Clerk
  const newUser = {
    userId,
    email: user.email_addresses?.[0]?.email_address, // Get the primary email address
    username: user.username || `${user.first_name} ${user.last_name}`, // Use username or fallback to full name
    avatarUrl: user.profile_image_url, // Get avatar URL
    bannerUrl: null,
    reviews: [],
    customerDetails: {
      id: 'cus_NffrFeUfNV2Hib',
      object: 'customer',
      address: null,
      balance: 0,
      created: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      currency: null,
      default_source: null,
      delinquent: false,
      description: null,
      discount: null,
      invoice_prefix: '0759376C',
      invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
        rendering_options: null,
      },
      livemode: false,
      metadata: {},
      name: user.username || `${user.first_name} ${user.last_name}`, // Use username as default name
      next_invoice_sequence: 1,
      phone: null,
      preferred_locales: [],
      shipping: null,
    },
  };

  // Insert the new user into the database
  const result = await usersCollection.insertOne(newUser);

  return NextResponse.json({
    message: 'User registered successfully',
    userId: result.insertedId,
    customerDetails: newUser.customerDetails,
  });
}
