import { NextFunction, Request, Response } from 'express';
import { betsService } from '../../services';
import { BetWithId } from '../../schemas';

export async function getBet(req: Request, res: Response<{ bet: BetWithId }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const bet = await betsService.getOne({ id });

    if (bet) {
      res.status(200);
      res.send({ bet });
    }

  } catch (error) {
    next(error);
  }
}
