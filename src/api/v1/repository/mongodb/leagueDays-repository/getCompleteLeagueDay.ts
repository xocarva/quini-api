/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { leagueDaysCollection } from './leagueDaysCollection';
import { CompleteLeagueDayWithId, PartialLeagueDayWithId } from '../../../schemas';
import { buildCompleteLeagueDayAggregation } from './buildCompleteLeagueDayAggregation';


export async function getCompleteLeagueDay(params: PartialLeagueDayWithId): Promise<CompleteLeagueDayWithId | null> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const query = id ? { _id: new ObjectId(id), ...paramsData } : params;

  const pipeline = buildCompleteLeagueDayAggregation(query);
  const result = await leagueDaysCollection.aggregate(pipeline).toArray();

  if (result.length === 0) {
    return null;
  }

  const leagueDay = result[0];
  const { _id, ...leagueDayData } = leagueDay;

  return { id: _id.toString(), ...leagueDayData } as CompleteLeagueDayWithId;
}
