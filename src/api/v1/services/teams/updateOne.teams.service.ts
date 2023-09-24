import { getTeam, updateTeam } from '../../repository';
import { ConflictError, DatabaseError, NotFoundError } from '../../../../errors';
import { PartialTeam, TeamWithId, partialTeamSchema } from '../../schemas';

export async function updateOne(id: string, teamData: PartialTeam): Promise<TeamWithId> {
  let team: TeamWithId | null;

  try {
    team = await getTeam({ id });

  } catch (error) {
    throw new DatabaseError(`Error checking if team with id ${id} team exists`);
  }

  if (!team) {
    throw new NotFoundError(`Team with id ${id} not found`);
  }

  const updatedData = partialTeamSchema.parse(teamData);
  const { name } = updatedData;

  
  if (name) {
    let existingTeamWithThisName: TeamWithId | null;

    try {
      existingTeamWithThisName = await getTeam({ name });
      
    } catch (error) {
      throw new DatabaseError(`Error checkng if team with name ${name} exists`);
    }

    if (existingTeamWithThisName && existingTeamWithThisName.id !== id) {
      throw new ConflictError(`Name ${updatedData.name} is already in use`);
    }
  }

  try {
    const updated = await updateTeam(id, updatedData);
    return updated;
    
  } catch (error) {
    throw new DatabaseError('Error updating team');
  }
}
