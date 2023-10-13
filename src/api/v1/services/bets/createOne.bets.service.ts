import { getBet, getLeagueDay, saveBet } from '../../repository';
import { ConflictError, DatabaseError } from '../../../../errors';
import { Bet, BetWithId } from '../../schemas';

export async function createOne(betData: Bet): Promise<BetWithId> {
  const { leagueDayId, userId } = betData;

  let leagueExists: boolean;

  try {
    leagueExists = Boolean(await getLeagueDay({ id: leagueDayId }));

  } catch (error) {
    throw new DatabaseError('Error checking if league day exists');
  }

  if (!leagueExists) {
    throw new ConflictError(`Can not create bet for non existing league day ${leagueDayId}`);
  }

  let betExists: boolean;

  try {
    betExists = Boolean(await getBet({ leagueDayId, userId }));
  
  } catch (error) {
    throw new DatabaseError('Error checking if bet already exists');
  }

  if (betExists) {
    throw new ConflictError(`Bet for league day ${leagueDayId} by user ${userId} already exists`);
  }

  try {
    const bet = await saveBet(betData);
    return bet;
  
  } catch (error) {
    throw new DatabaseError('Error saving bet');
  }
}
