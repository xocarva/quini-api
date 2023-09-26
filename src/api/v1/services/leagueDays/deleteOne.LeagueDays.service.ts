import { deleteLeagueDay, getLeagueDay } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';

export async function deleteOne(id: string): Promise<void> {
  const leagueDay = await getLeagueDay({ id });

  if (!leagueDay) {
    throw new NotFoundError(`League day with id ${id} not found`);
  }

  const deleted = await deleteLeagueDay(id);

  if (!deleted) {
    throw new DatabaseError(`League day with id ${id} could not be deleted`);
  }
}
