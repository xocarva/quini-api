import z from 'zod';
import { teamWithIdSchema } from './team.schema';
import { ObjectId } from 'mongodb';

export const leagueDaySchema = z.object({
  season: z.string(),
  leagueDayNumber: z.coerce.number(),
  rowsData: z.array(
    z.object({
      position: z.number().min(1).max(16),
      homeTeamId: z.string().refine((value) => ObjectId.isValid(value), {
        message: 'homeTeamId not valid',
      }).transform((value) => new ObjectId(value)),
      awayTeamId: z.string().refine((value) => ObjectId.isValid(value), {
        message: 'awayTeamId not valid',
      }).transform((value) => new ObjectId(value)),
      result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
    }),
  ).length(16),
});

export const partialLeagueDaySchema = leagueDaySchema.extend({
  rowsData: z.array(
    z.object({
      position: z.number().min(1).max(16),
      homeTeamId: z.string().refine((value) => ObjectId.isValid(value), {
        message: 'homeTeamId not valid',
      }).transform((value) => new ObjectId(value)),
      awayTeamId: z.string().refine((value) => ObjectId.isValid(value), {
        message: 'awayTeamId not valid',
      }).transform((value) => new ObjectId(value)),
      result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
    })),
}).partial();

export const leagueDayWithIdSchema = leagueDaySchema.extend({ id: z.string() });

export const partialLeagueDayWithId = leagueDayWithIdSchema.partial();

export const completeLeagueDaySchema = leagueDayWithIdSchema.extend({
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeam: teamWithIdSchema,
    awayTeam: teamWithIdSchema,
    result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
  })),
});
