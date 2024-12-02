import bcrypt from 'bcryptjs';
import { FormState, SignupFormSchema } from '../lib/definitions';
import { MongoClient } from 'mongodb';
import { signIn } from 'next-auth/react';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}
const client = new MongoClient(uri);


export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into the database
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database
  try {
    await client.connect();
    const db = client.db('your-database-name');
    const users = db.collection('users');

    // Check if a user with this email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return { errors: { email: ['A user with this email already exists.'] } };
    }

    // Insert the new user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const user = result.insertedId;

    if (!user) {
      return {
        message: 'An error occurred while creating your account.',
      };
    }

    // 4. Create user session
    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!signInResult || signInResult.error) {
      return {
        message: 'Account created, but an error occurred during login.',
      };
    }

    // 5. Redirect user to dashboard or another page
    return { success: true, redirect: '/dashboard' };
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'An internal error occurred.' };
  } finally {
    await client.close();
  }
}
