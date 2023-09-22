import { Collection, MongoClient, Document } from 'mongodb';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const DB_AUTH = DB_USER && DB_PASSWORD
  ? `${DB_USER ?? ''}:${DB_PASSWORD ?? ''}@`
  : '';
const MONGO_URI = `mongodb://${DB_AUTH}${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const client = new MongoClient(MONGO_URI);

const db = client.db();

export function getCollection<T extends Document>(collectionName: string): Collection<T> {
  return db.collection<T>(collectionName);
}
