import { teamsCollection } from './teamsCollection';
import { Team, TeamWithId } from '../../../schemas';

export async function saveTeam(team: Team): Promise<TeamWithId> {
  const result = await teamsCollection.insertOne(team);

  if (!result.acknowledged) {
    throw new Error('Error saving team');
  }

  return {
    ...team,
    id: result.insertedId.toString(),
  };
}
