// src/lib/mongodb-client.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Në development ruaje client-in në globalThis
  // që Hot Reload të mos krijojë shumë lidhje.
  const globalWithMongo = globalThis;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Në production krijohet një promise për këtë instance.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
