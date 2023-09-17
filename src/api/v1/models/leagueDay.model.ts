/* eslint-disable @typescript-eslint/naming-convention */
import z from 'zod';
import { TeamModel, teamWithIdSchema } from './team.model';
import { MongoDBService } from '../services';
import { ObjectId } from 'mongodb';

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
  private static leagueDaysCollection = MongoDBService.getCollection<LeagueDay>('leagueDays');

  static async findAll(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay[]> {
    const { id, ...paramsData } = params;
    const result = await this.leagueDaysCollection.find(
      id ? { _id: new ObjectId(id), ...paramsData } : params,
    ).toArray();
  
    const leagueDaysData  = result.map(leagueDay => {
      const { _id, ...leagueDayData } = leagueDay;
      return { id: _id.toString(), ...leagueDayData };
    });

    const teams = await TeamModel.findAll({});
  
    return leagueDaysData.map((leagueDayData) => {
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
    });
  }

  static async findOne(params: PartialLeagueDayWithId): Promise<LeagueDayWithId | null> {
    const { id, ...paramsData } = params;

    if (id && !ObjectId.isValid(id)) {
      return null;
    }
  
    const result = await this.leagueDaysCollection.findOne(id ? { _id: new ObjectId(id), ...paramsData } : params);
  
    if (result) {
      const { _id, ...leagueDayData } = result;
      return { id: _id.toString(), ...leagueDayData };
    }
  
    return null;
  }

  static async findOneComplete(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay | null> {
    const leagueDayData = await this.findOne(params);
    const teams = await TeamModel.findAll({});

    if (leagueDayData === null) {
      return null;
    }

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

  static async createOne(leagueDay: LeagueDay): Promise<LeagueDayWithId> {
    const result = await this.leagueDaysCollection.insertOne(leagueDay);
    if (!result.acknowledged) throw new Error('Error saving team');
  
    return {
      ...leagueDay,
      id: result.insertedId.toString(),
    };
  }

  static async updateOne(id: string, leagueDayData: PartialLeagueDay): Promise<number> {
    const result = await this.leagueDaysCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: leagueDayData },
    );

    if (!result.acknowledged) {
      throw new Error('Error updating league day');
    }
  
    return result.modifiedCount;
  }

  static async deleteOne(id: string): Promise<number> {
    if (id && !ObjectId.isValid(id)) {
      return 0;
    }
  
    const result = await this.leagueDaysCollection.deleteOne({ _id: new ObjectId(id) });
  
    if (!result.acknowledged) {
      throw new Error('Error deleting league day');
    }
  
    return result.deletedCount;
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

//TODO fix rowsData patch when updating rows partially
//TODO refactor findOneComplete and findAll to return CompleteLeagueDay with only one query
