import { NextFunction, Request, Response } from 'express';
import { leagueDaysService } from '../../services';

export async function deleteLeagueDay(req: Request, res: Response<{ message: string }>, next: NextFunction) {
  const { id } = req.params;

  try {
    await leagueDaysService.deleteOne(id);

    res.status(200);
    res.send({ message: `League day with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
