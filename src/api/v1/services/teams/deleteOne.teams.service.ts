import { deleteTeam, getTeam } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';

export async function deleteOne(id: string): Promise<void> {
  const team = await getTeam({ id });

  if (!team) {
    throw new NotFoundError(`Team with id ${id} not found`);
  }

  const deleted = await deleteTeam(id);

  if (!deleted) {
    throw new DatabaseError(`Team with id ${id} could not be deleted`);
  }
}
