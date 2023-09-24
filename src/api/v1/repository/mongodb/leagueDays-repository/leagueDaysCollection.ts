import { getCollection } from '../db';
import { LeagueDay } from '../../../schemas';

export const leagueDaysCollection = getCollection<LeagueDay>('leagueDays');
