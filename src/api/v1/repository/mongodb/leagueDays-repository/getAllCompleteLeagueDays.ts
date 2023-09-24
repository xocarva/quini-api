/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { buildCompleteLeagueDayAggregation } from './buildCompleteLeagueDayAggregation';
import { leagueDaysCollection } from './leagueDaysCollection';
import { CompleteLeagueDay, PartialLeagueDayWithId } from '../../../schemas';

export async function getAllCompleteLeagueDays(params: PartialLeagueDayWithId): Promise<CompleteLeagueDay[]> {
  const { id, ...paramsData } = params;
  const query = id ? { _id: new ObjectId(id), ...paramsData } : params;

  const pipeline = buildCompleteLeagueDayAggregation(query);
  const result = await leagueDaysCollection.aggregate(pipeline).toArray();

  return result.map(leagueDay => {
    const { _id, ...leagueDayData } = leagueDay;
    return { id: _id.toString(), ...leagueDayData };
  }) as CompleteLeagueDay[];
}
