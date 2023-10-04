import { getCollection } from '../db';
import { Bet } from '../../../schemas';

export const betsCollection = getCollection<Bet>('bets');
