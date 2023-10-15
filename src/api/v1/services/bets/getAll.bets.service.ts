import { DatabaseError } from '../../../../errors';
import { getAllBets } from '../../repository';
import { PartialBetWithId, BetWithId } from '../../schemas';

export function getAll(params: PartialBetWithId): Promise<BetWithId[]> {
  try {
    const bets = getAllBets(params);
    return bets;

  } catch (error) {
    throw new DatabaseError('Error retrieving bets');
  }
}
