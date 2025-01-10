import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so we don't create too many connections
  if (!global._mongoClientPromise) {
    await client.connect();
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  await client.connect();
  clientPromise = client.connect();
}

export default clientPromise;
