/* eslint-disable @typescript-eslint/naming-convention */
import z from 'zod';
import { ObjectId } from 'mongodb';
import { MongoDBService } from '../services';
import {
  completeLeagueDaySchema,
  leagueDaySchema,
  leagueDayWithIdSchema,
  partialLeagueDaySchema,
  partialLeagueDayWithId,
} from '../schemas';

export type LeagueDay = z.infer<typeof leagueDaySchema>;
export type PartialLeagueDay = z.infer<typeof partialLeagueDaySchema>;
export type LeagueDayWithId = z.infer<typeof leagueDayWithIdSchema>;
export type CompleteLeagueDay = z.infer<typeof completeLeagueDaySchema>;
export type PartialLeagueDayWithId = z.infer<typeof partialLeagueDayWithId>;

export class LeagueDayModel {
  private static leagueDaysCollection = MongoDBService.getCollection<LeagueDay>('leagueDays');

  private static buildCompleteLeagueDayAggregation(query: any) {
    return [
      { $match: query },
      {
        $lookup: {
          from: 'teams',
          localField: 'rowsData.homeTeamId',
          foreignField: '_id',
          as: 'homeTeams',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'rowsData.awayTeamId',
          foreignField: '_id',
          as: 'awayTeams',
        },
      },
      {
        $addFields: {
          rowsData: {
            $map: {
              input: '$rowsData',
              as: 'row',
              in: {
                position: '$$row.position',
                homeTeam: {
                  id: { $toString: '$$row.homeTeamId' },
                  name: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: '$homeTeams',
                              as: 'team',
                              cond: { $eq: ['$$team._id', '$$row.homeTeamId'] },
                            },
                          },
                          as: 'filteredTeam',
                          in: '$$filteredTeam.name',
                        },
                      },
                      0,
                    ],
                  },
                },
                awayTeam: {
                  id: { $toString: '$$row.awayTeamId' },
                  name: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: '$awayTeams',
                              as: 'team', cond: { $eq: ['$$team._id', '$$row.awayTeamId'] },
                            },
                          },
                          as: 'filteredTeam',
                          in: '$$filteredTeam.name',
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          homeTeams: 0,
          awayTeams: 0,
        },
      },
    ];
  }

  static async findAll(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay[]> {
    const { id, ...paramsData } = params;
    const query = id ? { _id: new ObjectId(id), ...paramsData } : params;

    const pipeline = this.buildCompleteLeagueDayAggregation(query);
    const result = await this.leagueDaysCollection.aggregate(pipeline).toArray();

    return result.map(leagueDay => {
      const { _id, ...leagueDayData } = leagueDay;
      return { id: _id.toString(), ...leagueDayData };
    }) as CompleteLeagueDay[];
  }

  static async findOne(params: PartialLeagueDayWithId): Promise<LeagueDayWithId | null> {
    const { id, ...paramsData } = params;

    if (id && !ObjectId.isValid(id)) {
      return null;
    }
  
    const result = await this.leagueDaysCollection.findOne(
      id ? { _id: new ObjectId(id), ...paramsData } : params,
    );
  
    if (result) {
      const { _id, ...leagueDayData } = result;
      return { id: _id.toString(), ...leagueDayData };
    }
  
    return null;
  }

  static async findOneComplete(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay | null> {
    const { id, ...paramsData } = params;

    if (id && !ObjectId.isValid(id)) {
      return null;
    }

    const query = id ? { _id: new ObjectId(id), ...paramsData } : params;

    const pipeline = this.buildCompleteLeagueDayAggregation(query);
    const result = await this.leagueDaysCollection.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return null;
    }

    const leagueDay = result[0];
    const { _id, ...leagueDayData } = leagueDay;

    return { id: _id.toString(), ...leagueDayData } as CompleteLeagueDay;
  }

  static async createOne(leagueDay: LeagueDay): Promise<LeagueDayWithId> {
    const result = await this.leagueDaysCollection.insertOne(leagueDay);
    if (!result.acknowledged) throw new Error('Error saving league day');
  
    return {
      ...leagueDay,
      id: result.insertedId.toString(),
    };
  }

  static async updateOne(id: string, leagueDayData: PartialLeagueDay): Promise<number> {
    type UpdatableLeagueDayProperties = {
      [key: string]: any;
    } & PartialLeagueDay;

    type Indexable<T> = T & {
      [key: string]: any;
    };

    // Initial update query
    const updateQuery: any = {};

    // For non-array fields of the league day data
    for (const key in leagueDayData) {
      if (key !== 'rowsData') {
        updateQuery[key] = (leagueDayData as UpdatableLeagueDayProperties)[key];
      }
    }

    // Handle the rowsData field specially
    if (leagueDayData.rowsData) {
      for (const row of leagueDayData.rowsData) {
        const indexableRow = row as Indexable<typeof row>;
        for (const key in indexableRow) {
          if (key !== 'position') {
            updateQuery[`rowsData.$[element].${key}`] = indexableRow[key];
          }
        }
      }
    }

    // Execute the update
    const result = await this.leagueDaysCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateQuery },
      {
        arrayFilters: leagueDayData.rowsData
          ? [{ 'element.position': { $in: leagueDayData.rowsData.map(r => r.position) } }]
          : [],
      },
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
