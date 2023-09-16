/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { BetWithId, PartialBetWithId } from '../../../models';
import { betsCollection } from './betsCollection';

export async function findOneBet(params: PartialBetWithId): Promise<BetWithId | null> {  
  const { id, leagueDayId, userId, ...paramsData } = params;

  if (
    (id && !ObjectId.isValid(id))
    || (leagueDayId && !ObjectId.isValid(leagueDayId))
    || (userId && !ObjectId.isValid(userId))
  ) {
    return null;
  }

  const searchedId = id ? new ObjectId(id) : {};
  const searchedLeagueDayId = leagueDayId ? new ObjectId(leagueDayId) : {};
  const searchedUserId = userId ? new ObjectId(userId) : {};

  const result = await betsCollection.findOne(
    {
      ...searchedId,
      ...searchedLeagueDayId,
      ...searchedUserId,
      ...paramsData,
    },
  );

  if (result) {
    const { _id, leagueDayId: league, userId: user, ...betData } = result;
    return {
      id: _id.toString(),
      leagueDayId: league.toString(),
      userId: user.toString(),
      ...betData,
    };
  }

  return null;
}
