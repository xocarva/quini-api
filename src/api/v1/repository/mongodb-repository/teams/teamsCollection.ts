import { Team } from '../../../models';
import { db } from '../db';

export const teamsCollection = db.collection<Team>('teams');
