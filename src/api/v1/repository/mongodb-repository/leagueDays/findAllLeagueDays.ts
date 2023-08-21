/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { LeagueDayWithId, PartialLeagueDayWithId } from '../../../models';
import { leagueDaysCollection } from './leagueDaysCollection';

export async function findAllLeagueDays(params: PartialLeagueDayWithId): Promise<LeagueDayWithId[]> {
  const { id, ...paramsData } = params;
  const result = await leagueDaysCollection.find(id ? { _id: new ObjectId(id), ...paramsData } : params).toArray();

  const leagueDays = result.map(leagueDay => {
    const { _id, ...leagueDayData } = leagueDay;
    return { id: _id.toString(), ...leagueDayData };
  });
  
  return leagueDays;
}
