import { NextFunction, Request, Response } from 'express';
import { leagueDaysService } from '../../services';
import { CompleteLeagueDayWithId } from '../../schemas';

export async function getLeagueDay(req: Request, res: Response<{ leagueDay: CompleteLeagueDayWithId }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const leagueDay = await leagueDaysService.getOne({ id });

    if (leagueDay) {
      res.status(200);
      res.send({ leagueDay });
    }

  } catch (error) {
    next(error);
  }
}
