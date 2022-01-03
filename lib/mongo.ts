import { MongoClient } from 'mongodb';

const { MONGODB_URI } = process.env;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(dbName: string) {
    const client = await clientPromise;
    return client.db(dbName);
}