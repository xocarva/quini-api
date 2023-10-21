import { NextFunction, Request, Response } from 'express';
import { betsService } from '../../services';

export async function deleteBet(req: Request, res: Response<{ message: string }>, next: NextFunction) {
  const { id } = req.params;

  try {
    await betsService.deleteOne(id);

    res.status(200);
    res.send({ message: `Bet with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
