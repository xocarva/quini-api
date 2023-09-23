import { DatabaseError } from '../../../../errors';
import { getAllTeams } from '../../repository';
import { PartialTeamWithId, TeamWithId } from '../../schemas';

export function getAll(params: PartialTeamWithId): Promise<TeamWithId[]> {
  try {
    const teams = getAllTeams(params);
    return teams;

  } catch (error) {
    throw new DatabaseError('Error retrieving teams');
  }
}
