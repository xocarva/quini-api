import { User } from '../../../models';
import { db } from '../db';

export const usersCollection = db.collection<User>('users');
