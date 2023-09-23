import { Collection, MongoClient, Document, Db } from 'mongodb';
import { DatabaseError } from '../../../../errors';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const DB_AUTH = DB_USER && DB_PASSWORD
  ? `${DB_USER ?? ''}:${DB_PASSWORD ?? ''}@`
  : '';

const MONGO_URI = `mongodb://${DB_AUTH}${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let db: Db | undefined;

function initializeDB() {
  if (!db) {
    const client = new MongoClient(MONGO_URI);
    db = client.db();
  }
}

export function getCollection<T extends Document>(collectionName: string): Collection<T> {
  if (process.env.NODE_ENV !== 'test') {
    initializeDB();
  }
  
  if (!db) {
    throw new DatabaseError('Database is not initialized');
  }

  return db.collection<T>(collectionName);
}