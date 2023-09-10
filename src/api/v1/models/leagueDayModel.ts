import z from 'zod';
import {
  createOneLeagueDay,
  deleteOneLeagueDay,
  findAllLeagueDays, 
  findAllTeams,
  findOneLeagueDay,
  updateOneLeagueDay,
} from '../repository';
import { teamWithIdSchema } from './teamModel';

const leagueDaySchema = z.object({
  season: z.string(),
  leagueDayNumber: z.coerce.number(),
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeamId: z.string(),
    awayTeamId: z.string(),
    result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
  })).length(16),
});

const partialLeagueDaySchema = leagueDaySchema.extend({
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeamId: z.string(),
    awayTeamId: z.string(),
    result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
  })),
}).partial();

const leagueDayWithIdSchema = leagueDaySchema.extend({ id: z.string() });

const partialLeagueDayWithId = leagueDayWithIdSchema.partial();

const completeLeagueDaySchema = leagueDayWithIdSchema.extend({
  rowsData: z.array(z.object({
    position: z.number().min(1).max(16),
    homeTeam: teamWithIdSchema,
    awayTeam: teamWithIdSchema,
    result: z.enum(['0', '1', '2', 'm', 'x']).optional(),
  })),
});

export type LeagueDay = z.infer<typeof leagueDaySchema>;
export type PartialLeagueDay = z.infer<typeof partialLeagueDaySchema>;
export type LeagueDayWithId = z.infer<typeof leagueDayWithIdSchema>;
export type CompleteLeagueDay = z.infer<typeof completeLeagueDaySchema>;
export type PartialLeagueDayWithId = z.infer<typeof partialLeagueDayWithId>;


export class LeagueDayModel {
  static async findAll(params: PartialLeagueDayWithId): Promise<LeagueDayWithId[]> {
    return findAllLeagueDays(params);
  }

  static async findOne(params: PartialLeagueDayWithId): Promise<LeagueDayWithId | null> {
    return findOneLeagueDay(params);
  }

  static async findOneComplete(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay | null> {
    const leagueDayData = await findOneLeagueDay(params);
    const teams = await findAllTeams({});

    if (leagueDayData === null) return null;

    const rowsData = leagueDayData.rowsData.map((row) => ({
      position: row.position,
      homeTeam: {
        id: row.homeTeamId.toString(),
        name: teams.find((team) => team.id === row.homeTeamId.toString())?.name || '',
      },
      awayTeam: {
        id: row.awayTeamId.toString(),
        name: teams.find((team) => team.id === row.awayTeamId.toString())?.name || '',
      },
    }));

    return { ...leagueDayData, rowsData };
  }

  static async createOne(lDay: LeagueDay): Promise<LeagueDayWithId> {
    return createOneLeagueDay(lDay);
  }

  static async updateOne(id: string, leagueDayData: PartialLeagueDay): Promise<number> {
    return updateOneLeagueDay(id, leagueDayData);
  }

  static async deleteOne(id: string): Promise<number> {
    return deleteOneLeagueDay(id);
  }

  static validateOne(leagueDay: any): LeagueDay {
    return leagueDaySchema.parse(leagueDay);
  }
  
  static validateOnePartial(leagueDayData: any): PartialLeagueDay {
    return partialLeagueDaySchema.parse(leagueDayData);
  }
  
  static validateOneWithId(leagueDay: any): LeagueDayWithId {
    return leagueDayWithIdSchema.parse(leagueDay);
  }
  
  static validateOnePartialWithId(leagueDayData: any): PartialLeagueDayWithId {
    return partialLeagueDayWithId.parse(leagueDayData);
  }
}

//TODO return team names in both GET request
//TODO fix rowsData patch when updating rows partially