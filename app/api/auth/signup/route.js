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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user with additional attributes
  const newUser = {
    username,
    email,
    avatarUrl:"/default-avatar.svg",
    bannerUrl:null,
    password: hashedPassword,
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
      name: username, // Use username as default name
      next_invoice_sequence: 1,
      phone: null,
      preferred_locales: [],
      shipping: null,
    },
  };

  // Insert new user into database
  const result = await usersCollection.insertOne(newUser);

  return NextResponse.json({
    message: 'User registered successfully',
    userId: result.insertedId,
    customerDetails: newUser.customerDetails,
  });
}
