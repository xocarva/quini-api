import z from 'zod';

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const partialUserSchema = userSchema.partial();
export const userWithIdSchema = userSchema.extend({ id: z.string() });
export const partialUserWithIdSchema = userWithIdSchema.partial();

export type User = z.infer<typeof userSchema>;
export type PartialUser = z.infer<typeof partialUserSchema>;
export type UserWithId = z.infer<typeof userWithIdSchema>;
export type PartialUserWithId = z.infer<typeof partialUserWithIdSchema>;
