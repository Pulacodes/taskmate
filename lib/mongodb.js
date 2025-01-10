
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  if (!global._mongoClientPromise) {
    
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client

  clientPromise = client.connect();
}

export default clientPromise;
