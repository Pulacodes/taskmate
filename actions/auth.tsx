import { FormState, SignupFormSchema } from '../lib/definitions';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}
const client = new MongoClient(uri);


export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early with errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // Connect to MongoDB
  await client.connect();
  const db = client.db('your-database-name');
  const users = db.collection('users');

  // Check if the user already exists
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return {
      errors: { email: ['A user with this email already exists.'] },
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database
  const newUser = {
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  await users.insertOne(newUser);

  // Return success message or the created user
  return { success: true, user: { name, email } };
}
