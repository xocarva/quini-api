import z from 'zod';

export const teamSchema = z.object({
  name: z.string(),
});

export const partialTeamSchema = teamSchema.partial();
export const teamWithIdSchema = teamSchema.extend({ id: z.string() });
export const partialTeamWithIdSchema = teamWithIdSchema.partial();

export type Team = z.infer<typeof teamSchema>;
export type PartialTeam = z.infer<typeof partialTeamSchema>;
export type TeamWithId = z.infer<typeof teamWithIdSchema>;
export type PartialTeamWithId = z.infer<typeof partialTeamWithIdSchema>;
