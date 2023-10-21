import { NextFunction, Request, Response } from 'express';
import { betsService } from '../../services';
import { Bet, betSchema } from '../../schemas';

export async function createBet(req: Request<Bet>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const bet = betSchema.parse(body);
    const { id } = await betsService.createOne(bet);

    res.status(201);
    res.send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
