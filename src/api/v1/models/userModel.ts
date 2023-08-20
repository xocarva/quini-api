import * as z from 'zod';
import { findOneUser, createOneUser, updateOneUser } from '../repository';

export const userSchema = z.object({
  name: z.string(),
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

export class UserModel {
  static async findOne(params: PartialUserWithId): Promise<UserWithId | null> {
    return findOneUser(params);
  }

  static async createOne(user: User): Promise<UserWithId> {
    return createOneUser(user);
  }

  static async updateOne(id: string, userData: PartialUser) {
    return updateOneUser(id, userData);
  }

  static validateOne(user: any): User {
    return userSchema.parse(user);
  }
}
