import { getCompleteLeagueDay } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';
import { CompleteLeagueDayWithId, PartialLeagueDayWithId } from '../../schemas';

export async function getOne(params: PartialLeagueDayWithId): Promise<CompleteLeagueDayWithId> {
  let leagueDay: CompleteLeagueDayWithId | null;
  
  try {
    leagueDay = await getCompleteLeagueDay(params);
  
  } catch (error) {
    throw new DatabaseError('Error retrieving league day');
  }

  if (!leagueDay) {
    throw new NotFoundError('LeagueDay not found');
  }
  
  return leagueDay;
}
