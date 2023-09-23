import { getCollection } from '../db';
import { Team } from '../../../schemas';

export const teamsCollection = getCollection<Team>('teams');
