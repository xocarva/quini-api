import z from 'zod';
import { ObjectId } from 'mongodb';
import { MongoDBService } from '../services';

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  password: z.string().min(8),
});

const partialUserSchema = userSchema.partial();
const userWithIdSchema = userSchema.extend({ id: z.string() });
const partialUserWithIdSchema = userWithIdSchema.partial();

export type User = z.infer<typeof userSchema>;
export type PartialUser = z.infer<typeof partialUserSchema>;
export type UserWithId = z.infer<typeof userWithIdSchema>;
export type PartialUserWithId = z.infer<typeof partialUserWithIdSchema>;

const usersCollection = MongoDBService.getCollection<User>('users');

export class UserModel {
  static async findOne(params: PartialUserWithId): Promise<UserWithId | null> {
    const { id, ...paramsData } = params;

    if (id && !ObjectId.isValid(id)) {
      return null;
    }
  
    const result = await usersCollection.findOne(
      id ? { _id: new ObjectId(id), ...paramsData } : params,
    );
  
    if (result) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _id, ...userData } = result;
      return { id: _id.toString(), ...userData };
    }
  
    return null;
  }

  static async createOne(user: User): Promise<UserWithId> {
    const result = await usersCollection.insertOne(user);

    if (!result.acknowledged) {
      throw new Error('Error saving user');
    }
  
    return {
      ...user,
      id: result.insertedId.toString(),
    };
  }

  static async updateOne(id: string, userData: PartialUser) {
    const result = await usersCollection.updateOne({
      _id: new ObjectId(id) },
    { $set: userData },
    );

    if (result.acknowledged) {
      throw new Error('Error updating user');
    }
  
    return result.modifiedCount;
  }

  static async deleteOne(id: string): Promise<number> {
    if (id && !ObjectId.isValid(id)) {
      return 0;
    }
  
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
  
    if (!result.acknowledged) {
      throw new Error('Error deleting user');
    }
  
    return result.deletedCount;
  }

  static validateOne(user: any): User {
    return userSchema.parse(user);
  }
}

