/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { leagueDaysCollection } from './leagueDaysCollection';
import { LeagueDayWithId, PartialLeagueDayWithId } from '../../../schemas';

export async function getLeagueDay(params: PartialLeagueDayWithId): Promise<LeagueDayWithId | null> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await leagueDaysCollection.findOne(
    id ? { _id: new ObjectId(id), ...paramsData } : params,
  );

  if (result) {
    const { _id, ...teamData } = result;
    return { id: _id.toString(), ...teamData };
  }

  return null;
}
