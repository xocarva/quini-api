import { getBet, updateBet } from '../../repository';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '../../../../errors';
import { BetWithId, PartialBet, partialBetSchema } from '../../schemas';

export async function updateOne(id: string, betData: PartialBet): Promise<BetWithId> {
  let bet: BetWithId | null;

  try {
    bet = await getBet({ id });
  } catch (error) {
    throw new DatabaseError(`Error checking if bet with id ${id} exists`);
  }

  if (!bet) {
    throw new NotFoundError(`Bet with id ${id} not found`);
  }

  const updatedData = partialBetSchema.parse(betData);
  const { leagueDayId } = updatedData;

  if (leagueDayId) {
    let existingBetWithThisLeagueDayId: BetWithId | null;
    try {
      existingBetWithThisLeagueDayId = await getBet({ leagueDayId });
      
    } catch (error) {
      throw new DatabaseError(
        `Error checkng if bet for league day ${leagueDayId} exists`,
      );
    }

    if (existingBetWithThisLeagueDayId
          && existingBetWithThisLeagueDayId.leagueDayId === bet.leagueDayId
          && existingBetWithThisLeagueDayId.userId === bet.userId
          && existingBetWithThisLeagueDayId.id !== id
    ) {
      throw new ConflictError(
        `Bet for league day ${bet.leagueDayId} by user ${bet.userId} already exists`,
      );
    }
  }

  try {
    const updated = await updateBet(id, updatedData);
    return updated;

  } catch (error) {
    throw new DatabaseError('Error updating bet');
  }
}
