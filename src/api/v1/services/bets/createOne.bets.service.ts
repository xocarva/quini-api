import { getBet, getLeagueDay, saveBet } from '../../repository';
import { ConflictError, DatabaseError } from '../../../../errors';
import { Bet, BetWithId, LeagueDayWithId } from '../../schemas';

export async function createOne(betData: Bet): Promise<BetWithId> {
  const { leagueDayId, userId } = betData;

  let leagueDayExists: boolean;
  let existingLeagueDay: LeagueDayWithId | null;

  try {
    existingLeagueDay = await getLeagueDay({ id: leagueDayId });
    leagueDayExists = Boolean(existingLeagueDay);

  } catch (error) {
    throw new DatabaseError('Error checking if league day exists');
  }

  if (!leagueDayExists) {
    throw new ConflictError(`Can not create bet for non existing league day ${leagueDayId}`);
  }

  if (existingLeagueDay?.betsClosed) {
    throw new ConflictError(`Bets are closed for league day ${leagueDayId}`);
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
