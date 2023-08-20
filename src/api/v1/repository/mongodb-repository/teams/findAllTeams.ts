/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { PartialTeamWithId, TeamWithId } from '../../../models';
import { teamsCollection } from './teamsCollection';

export async function findAllTeams(params: PartialTeamWithId): Promise<TeamWithId[]> {
  const { id, ...paramsData } = params;
  const result = await teamsCollection.find(id ? { _id: new ObjectId(id), ...paramsData } : params).toArray();

  const teams = result.map(team => {
    const { _id, ...teamData } = team;
    return { id: _id.toString(), ...teamData };
  });
  
  return teams;
}
