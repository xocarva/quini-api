import { teamsCollection } from './teamsCollection';
import { Team, TeamWithId } from '../../../schemas';

export async function saveTeam(team: Team): Promise<TeamWithId> {
  const result = await teamsCollection.insertOne(team);

  if (!result.acknowledged) {
    throw new Error();
  }

  return {
    ...team,
    id: result.insertedId.toString(),
  };
}
