import { getAllCompleteLeagueDays } from '../../repository';
import { DatabaseError } from '../../../../errors';
import { CompleteLeagueDayWithId, PartialLeagueDayWithId } from '../../schemas';

export async function getAll(params: PartialLeagueDayWithId): Promise<CompleteLeagueDayWithId[]> {
  try {
    const leagueDays = await getAllCompleteLeagueDays(params);
    return leagueDays;

  } catch (error) {
    throw new DatabaseError('Error retrieving all league days');
  }
}
