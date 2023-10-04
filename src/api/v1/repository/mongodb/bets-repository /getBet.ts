/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { betsCollection } from './betsCollection';
import { BetWithId, PartialBetWithId } from '../../../schemas';

export async function getBet(params: PartialBetWithId): Promise<BetWithId | null> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await betsCollection.findOne(
    id ? { _id: new ObjectId(id), ...paramsData } : params,
  );

  if (result) {
    const { _id, ...betData } = result;
    return { id: _id.toString(), ...betData };
  }

  return null;
}
