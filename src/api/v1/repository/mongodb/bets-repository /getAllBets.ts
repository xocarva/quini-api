/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { betsCollection } from './betsCollection';
import { PartialBetWithId, BetWithId } from '../../../schemas';

export async function getAllBets(params: PartialBetWithId): Promise<BetWithId[]> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return [];
  }

  const result = await betsCollection.find(
    id ? { _id: new ObjectId(id), ...paramsData } : params,
  ).toArray();

  const bets =  result.map(team => {
    const { _id, ...teamData } = team;
    return { id: _id.toString(), ...teamData };
  });

  return bets;
}
