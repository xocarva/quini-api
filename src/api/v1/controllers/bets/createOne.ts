import { NextFunction, Request, Response } from 'express';
import { Bet, BetModel } from '../../models';

export async function createOne(req: Request<Bet>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const bet = BetModel.validateOne(body);
    const { leagueDayId, userId } = bet;
    const betExists = !!await BetModel.findOne({ leagueDayId, userId });
  
    if (betExists) {
      res.status(409);
      throw new Error('Bet made by this user for this league day already exists');
    }
  
    const { id } = await BetModel.createOne(bet);
    res.status(201).send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
