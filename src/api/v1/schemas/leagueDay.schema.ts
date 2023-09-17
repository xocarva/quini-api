import z from 'zod';
import { teamWithIdSchema } from './team.schema';

export const leagueDaySchema = z.object({
  season: z.string(),
  leagueDayNumber: z.coerce.number(),
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeamId: z.string(),
    awayTeamId: z.string(),
    result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
  })).length(16),
});

export const partialLeagueDaySchema = leagueDaySchema.extend({
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeamId: z.string(),
    awayTeamId: z.string(),
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
