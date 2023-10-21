import { NextFunction, Request, Response } from 'express';
import { betsService } from '../../services';
import { BetWithId, partialBetSchema } from '../../schemas';

export async function updateBet(req: Request, res: Response<{ bet: BetWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = partialBetSchema.parse(body);
    const bet = await betsService.updateOne(id, updateData);

    res.status(200);
    res.send({ bet });
  
  } catch (error) {
    next(error);
  }
}
