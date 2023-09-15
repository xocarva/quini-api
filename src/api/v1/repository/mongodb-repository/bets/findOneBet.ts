/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { BetWithId, PartialBetWithId } from '../../../models';
import { betsCollection } from './betsCollection';

export async function findOneBet(params: PartialBetWithId): Promise<BetWithId | null> {  
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await betsCollection.findOne(id ? { _id: new ObjectId(id), ...paramsData } : params);

  if (result) {
    const { _id, ...betData } = result;
    return { id: _id.toString(), ...betData };
  }

  return null;
}
