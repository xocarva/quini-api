import { Bet } from '../../../models';
import { db } from '../db';

export const betsCollection = db.collection<Bet>('bets');
