import { LeagueDay, LeagueDayWithId } from '../../../models';
import { leagueDaysCollection } from './leagueDaysCollection';

export async function createOneLeagueDay(leagueDay: LeagueDay): Promise<LeagueDayWithId> {
  const result = await leagueDaysCollection.insertOne(leagueDay);
  if (!result.acknowledged) throw new Error('Error saving team');

  return {
    ...leagueDay,
    id: result.insertedId.toString(),
  };
}
