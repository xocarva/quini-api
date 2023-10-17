import { deleteBet, getBet } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';

export async function deleteOne(id: string): Promise<void> {
  const bet = await getBet({ id });

  if (!bet) {
    throw new NotFoundError(`Bet with id ${id} not found`);
  }

  const deleted = await deleteBet(id);

  if (!deleted) {
    throw new DatabaseError(`Bet with id ${id} could not be deleted`);
  }
}
