import { getLeagueDay, saveLeagueDay } from '../../repository';
import { ConflictError, DatabaseError } from '../../../../errors';
import { LeagueDay, LeagueDayWithId } from '../../schemas';

export async function createOne(leagueDayData: LeagueDay): Promise<LeagueDayWithId> {
  const { season, leagueDayNumber } = leagueDayData;

  let leagueDayExists: boolean;

  try {
    leagueDayExists = Boolean(await getLeagueDay({ season, leagueDayNumber }));
    
  } catch (error) {
    throw new DatabaseError('Error checking if league day already exists');
  }

  if (leagueDayExists) {
    throw new ConflictError(`League day ${leagueDayNumber} for season ${leagueDayNumber} already exists`);
  }

  try {
    const leagueDay = await saveLeagueDay(leagueDayData);
    return leagueDay;
  
  } catch (error) {
    throw new DatabaseError('Error saving league day');
  }
}
