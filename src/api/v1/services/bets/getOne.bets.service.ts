import { getBet } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';
import { BetWithId, PartialBetWithId } from '../../schemas';

export async function getOne(params: PartialBetWithId): Promise<BetWithId> {
  let bet: BetWithId | null;
  
  try {
    bet = await getBet(params);
  
  } catch (error) {
    throw new DatabaseError('Error retrieving bet');
  }

  if (!bet) {
    throw new NotFoundError('Bet not found');
  }
  
  return bet;
}
