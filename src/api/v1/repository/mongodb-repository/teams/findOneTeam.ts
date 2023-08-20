/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { PartialTeamWithId, TeamWithId } from '../../../models';
import { teamsCollection } from './teamsCollection';

export async function findOneTeam(params: PartialTeamWithId): Promise<TeamWithId | null> {  
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await teamsCollection.findOne(id ? { _id: new ObjectId(id), ...paramsData } : params);

  if (result) {
    const { _id, ...teamData } = result;
    return { id: _id.toString(), ...teamData };
  }

  return null;
}
