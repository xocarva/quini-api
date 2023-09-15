/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { BetWithId, PartialBetWithId } from '../../../models';
import { betsCollection } from './betsCollection';

export async function findAllBets(params: PartialBetWithId): Promise<BetWithId[]> {
  const { id, ...paramsData } = params;
  const result = await betsCollection.find(id ? { _id: new ObjectId(id), ...paramsData } : params).toArray();

  const bets = result.map(bet => {
    const { _id, ...betData } = bet;
    return { id: _id.toString(), ...betData };
  });
  
  return bets;
}
