/* eslint-disable @typescript-eslint/naming-convention */
import z from 'zod';
import { ObjectId } from 'mongodb';
import { MongoDBService } from '../services';

export const teamSchema = z.object({
  name: z.string(),
});

const partialTeamSchema = teamSchema.partial();
export const teamWithIdSchema = teamSchema.extend({ id: z.string() });
const PartialTeamWithId = teamWithIdSchema.partial();

export type Team = z.infer<typeof teamSchema>;
export type PartialTeam = z.infer<typeof partialTeamSchema>;
export type TeamWithId = z.infer<typeof teamWithIdSchema>;
export type PartialTeamWithId = z.infer<typeof PartialTeamWithId>;

export class TeamModel {
  private static teamsCollection = MongoDBService.getCollection<Team>('teams');

  static async findAll(params: PartialTeamWithId): Promise<TeamWithId[]> {
    const { id, ...paramsData } = params;
    const result = await this.teamsCollection.find(
      id ? { _id: new ObjectId(id), ...paramsData } : params,
    ).toArray();
  
    const teams =  result.map(team => {
      const { _id, ...teamData } = team;
      return { id: _id.toString(), ...teamData };
    });

    return teams;
  }

  static async findOne(params: PartialTeamWithId): Promise<TeamWithId | null> {
    const { id, ...paramsData } = params;

    if (id && !ObjectId.isValid(id)) {
      return null;
    }
  
    const result = await this.teamsCollection.findOne(id ? { _id: new ObjectId(id), ...paramsData } : params);
  
    if (result) {
      const { _id, ...teamData } = result;
      return { id: _id.toString(), ...teamData };
    }
  
    return null;
  }

  static async createOne(team: Team): Promise<TeamWithId> {
    const result = await this.teamsCollection.insertOne(team);
    if (!result.acknowledged) throw new Error('Error saving team');
  
    return {
      ...team,
      id: result.insertedId.toString(),
    };
  }

  static async updateOne(id: string, teamData: PartialTeam): Promise<number> {
    const result = await this.teamsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: teamData },
    );

    if (!result.acknowledged) {
      throw new Error('Error updating team');
    }
  
    return result.modifiedCount;
  }

  static async deleteOne(id: string): Promise<number> {
    if (id && !ObjectId.isValid(id)) {
      return 0;
    }
  
    const result = await this.teamsCollection.deleteOne({ _id: new ObjectId(id) });
  
    if (!result.acknowledged) {
      throw new Error('Error deleting team');
    }
  
    return result.deletedCount;
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
