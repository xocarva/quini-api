import { ObjectId } from 'mongodb';
import { leagueDaysCollection } from './leagueDaysCollection';
import { LeagueDay, LeagueDayWithId } from '../../../schemas';

export async function saveLeagueDay(leagueDay: LeagueDay): Promise<LeagueDayWithId> {
  const transformedLeagueDay = {
    ...leagueDay,
    rowsData: leagueDay.rowsData.map(row => ({
      ...row,
      homeTeamId: new ObjectId(row.homeTeamId),
      awayTeamId: new ObjectId(row.awayTeamId),
    })),
  };

  const result = await leagueDaysCollection.insertOne(transformedLeagueDay as any);
  if (!result.acknowledged) {
    throw new Error('Error saving league day');
  }

  return {
    ...leagueDay,
    id: result.insertedId.toString(),
  };
}
