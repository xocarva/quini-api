import { LeagueDay } from '../../../models';
import { db } from '../db';

export const leagueDaysCollection = db.collection<LeagueDay>('teams');
