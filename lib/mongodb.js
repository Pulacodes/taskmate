import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to avoid creating too many connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri); // No options required
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri); // No options required
  clientPromise = client.connect();
}

export default clientPromise;

