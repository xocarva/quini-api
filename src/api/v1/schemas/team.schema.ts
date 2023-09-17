import z from 'zod';

export const teamSchema = z.object({
  name: z.string(),
});

export const partialTeamSchema = teamSchema.partial();
export const teamWithIdSchema = teamSchema.extend({ id: z.string() });
export const PartialTeamWithId = teamWithIdSchema.partial();
