import { NextFunction, Request, Response } from 'express';
import { LeagueDayModel, LeagueDay } from '../../models';

export async function findOne(req: Request, res: Response<{ leagueDay: LeagueDay }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const leagueDay = await LeagueDayModel.findOne({ id });

    if (!leagueDay) {
      res.status(404);
      throw new Error('Team not found');
    }

    res.status(200).send({ leagueDay });

  } catch (error) {
    next(error);
  }
}
