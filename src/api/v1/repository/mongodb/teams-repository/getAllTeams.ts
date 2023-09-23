/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { teamsCollection } from './teamsCollection';
import { PartialTeamWithId, TeamWithId } from '../../../schemas';

export async function getAllTeams(params: PartialTeamWithId): Promise<TeamWithId[]> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return [];
  }

  const result = await teamsCollection.find(
    id ? { _id: new ObjectId(id), ...paramsData } : params,
  ).toArray();

  const teams =  result.map(team => {
    const { _id, ...teamData } = team;
    return { id: _id.toString(), ...teamData };
  });

  return teams;
}
