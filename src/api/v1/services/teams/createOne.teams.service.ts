import { getTeam, saveTeam } from '../../repository';
import { ConflictError, DatabaseError } from '../../../../errors';
import { Team, TeamWithId } from '../../schemas';

export async function createOne(teamData: Team): Promise<TeamWithId> {
  let teamExists: boolean;

  try {
    teamExists = Boolean(await getTeam({ name: teamData.name }));

  } catch (error) {
    throw new DatabaseError('Error checking if team exists');
  }

  if (teamExists) {
    throw new ConflictError(`Team with name ${teamData.name} already exists`);
  }

  try {
    const team = await saveTeam(teamData);
    return team;
  
  } catch (error) {
    throw new DatabaseError('Error saving team');
  }
}
