/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { teamsCollection } from './teamsCollection';
import { PartialTeam, TeamWithId } from '../../../schemas';

export async function updateTeam(id: string, teamData: PartialTeam) : Promise<TeamWithId> {
  const result = await teamsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: teamData },
    { returnDocument: 'after' },
  );

  if (!result.value) {
    throw new Error('Error updating team or team not found');
  }

  const { _id, ...rest } = result.value;

  return { id: result.value._id.toString(), ...rest };
}
