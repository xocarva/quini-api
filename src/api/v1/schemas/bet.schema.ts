import z from 'zod';

export const betSchema = z.object({
  leagueDayId: z.string(),
  userId: z.string(),
  predictions: z.array(
    z.object({
      position: z.number().min(1).max(16),
      result: z.enum(['0', '1', '2', 'm', 'x']),
    }),
  ).length(16),
});

export const partialBetSchema = betSchema.extend({
  predictions: z.array(
    z.object({
      position: z.number().min(1).max(16),
      result: z.enum(['0', '1', '2', 'm', 'x']),
    }),
  ),
}).partial();

export const betWithIdSchema = betSchema.extend({ id: z.string() });
export const partialBetWithIdSchema = betWithIdSchema.partial();

export type Bet = z.infer<typeof betSchema>;
export type PartialBet = z.infer<typeof partialBetSchema>;
export type BetWithId = z.infer<typeof betWithIdSchema>;
export type PartialBetWithId = z.infer<typeof partialBetWithIdSchema>;
