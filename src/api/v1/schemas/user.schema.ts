import z from 'zod';

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  password: z.string().min(8),
});

export const partialUserSchema = userSchema.partial();
export const userWithIdSchema = userSchema.extend({ id: z.string() });
export const partialUserWithIdSchema = userWithIdSchema.partial();
