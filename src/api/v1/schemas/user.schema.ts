import z from 'zod';

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

