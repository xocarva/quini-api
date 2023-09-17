import { NextFunction, Request, Response } from 'express';
import { LeagueDayModel, CompleteLeagueDay } from '../../models';

export async function findOne(req: Request, res: Response<{ leagueDay: CompleteLeagueDay }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const leagueDay = await LeagueDayModel.findOneComplete({ id });

    if (!leagueDay) {
      res.status(404);
      throw new Error('League day not found');
    }

    res.status(200).send({ leagueDay });

  } catch (error) {
    next(error);
  }
}
