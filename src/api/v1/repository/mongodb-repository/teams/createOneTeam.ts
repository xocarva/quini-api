import { Team, TeamWithId } from '../../../models';
import { teamsCollection } from './teamsCollection';

export async function createOneTeam(team: Team): Promise<TeamWithId> {
  const result = await teamsCollection.insertOne(team);
  if (!result.acknowledged) throw new Error('Error saving team');

  return {
    ...team,
    id: result.insertedId.toString(),
  };
}
