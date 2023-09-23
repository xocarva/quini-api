import { DatabaseError, NotFoundError } from '../../../../errors';
import { getTeam } from '../../repository';
import { PartialTeamWithId, TeamWithId } from '../../schemas';

export async function getOne(params: PartialTeamWithId): Promise<TeamWithId> {
  let team: TeamWithId | null;
  
  try {
    team = await getTeam(params);
  } catch (error) {
    throw new DatabaseError('Error retrieving team');
  }

  if (!team) {
    throw new NotFoundError('Team not found');
  }
  
  return team;
}
