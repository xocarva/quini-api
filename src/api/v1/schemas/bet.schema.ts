import z from 'zod';
import { ObjectId } from 'mongodb';

export const betSchema = z.object({
  leagueDayId: z.string().refine((value) => ObjectId.isValid(value), {
    message: 'leagueDayId not valid',
  }).transform((value) => new ObjectId(value)),
  userId: z.string().refine((value) => ObjectId.isValid(value), {
    message: 'userId not valid',
  }).transform((value) => new ObjectId(value)),
  predictions: z.array(
    z.object({
      position: z.number().min(1).max(16),
      result: z.enum(['0', '1', '2', 'm', 'x']),
    }),
  ).length(16),
});

export const partialBetSchema = betSchema.partial();
export const betWithIdSchema = betSchema.extend({ id: z.string() });
export const PartialBetWithId = betWithIdSchema.partial();
