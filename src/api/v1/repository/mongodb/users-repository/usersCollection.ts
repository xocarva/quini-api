import { getCollection } from '../db';
import { User } from '../../../schemas';

export const usersCollection = getCollection<User>('users');
