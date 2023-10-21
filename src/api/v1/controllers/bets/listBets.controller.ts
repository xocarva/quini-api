import { NextFunction, Request, Response } from 'express';
import { betsService } from '../../services';
import { BetWithId, partialBetWithIdSchema } from '../../schemas';

export async function listBets(req: Request, res: Response<{ bets: BetWithId[] }>, next: NextFunction) {
  try {
    const params = partialBetWithIdSchema.parse(req.query);
    const bets = await betsService.getAll(params);
    res.status(200);
    res.send({ bets });

  } catch (error) {
    next(error);
  }
}
