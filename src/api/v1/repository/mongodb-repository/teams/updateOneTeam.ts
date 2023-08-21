import { ObjectId } from 'mongodb';
import { PartialTeam } from '../../../models';
import { teamsCollection } from './teamsCollection';

export async function updateOneTeam(id: string, teamData: PartialTeam): Promise<number> {
  const result = await teamsCollection.updateOne({ _id: new ObjectId(id) }, { $set: teamData });

  if (!result.acknowledged) throw new Error('Error updating team');

  return result.modifiedCount;
}
