import z from 'zod';
import { createOneTeam, deleteOneTeam, findAllTeams, findOneTeam, updateOneTeam } from '../repository';

export const teamSchema = z.object({
  name: z.string(),
});

const partialTeamSchema = teamSchema.partial();
const teamWithIdSchema = teamSchema.extend({ id: z.string() });
const PartialTeamWithId = teamWithIdSchema.partial();

export type Team = z.infer<typeof teamSchema>;
export type PartialTeam = z.infer<typeof partialTeamSchema>;
export type TeamWithId = z.infer<typeof teamWithIdSchema>;
export type PartialTeamWithId = z.infer<typeof PartialTeamWithId>;

export class TeamModel {
  static async findAll(params: PartialTeamWithId): Promise<TeamWithId[]> {
    return findAllTeams(params);
  }

  static async findOne(params: PartialTeamWithId): Promise<TeamWithId | null> {
    return findOneTeam(params);
  }

  static async createOne(team: Team): Promise<TeamWithId> {
    return createOneTeam(team);
  }

  static async updateOne(id: string, teamData: PartialTeam): Promise<number> {
    return updateOneTeam(id, teamData);
  }

  static async deleteOne(id: string): Promise<number> {
    return deleteOneTeam(id);
  }

  static validateOne(team: any): Team {
    return teamSchema.parse(team);
  }
  
  static validateOnePartial(team: any): PartialTeam {
    return partialTeamSchema.parse(team);
  }
  
  static validateOneWithId(team: any): TeamWithId {
    return teamWithIdSchema.parse(team);
  }
  
  static validateOnePartialWithId(team: any): PartialTeamWithId {
    return PartialTeamWithId.parse(team);
  }
}
