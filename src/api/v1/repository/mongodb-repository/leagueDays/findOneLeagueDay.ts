/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { LeagueDayWithId, PartialLeagueDayWithId  } from '../../../models';
import { leagueDaysCollection } from './leagueDaysCollection';

export async function findOneLeagueDay(params: PartialLeagueDayWithId): Promise<LeagueDayWithId | null> {  
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await leagueDaysCollection.findOne(id ? { _id: new ObjectId(id), ...paramsData } : params);

  if (result) {
    const { _id, ...leagueDayData } = result;
    return { id: _id.toString(), ...leagueDayData };
  }

  return null;
}
