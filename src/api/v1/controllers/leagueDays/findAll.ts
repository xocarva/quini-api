import { NextFunction, Request, Response } from 'express';
import { LeagueDay, LeagueDayModel } from '../../models';

export async function findAll(req: Request, res: Response<{ leagueDays: LeagueDay[] }>, next: NextFunction) {
  try {
    const params = LeagueDayModel.validateOnePartialWithId(req.query);
    const leagueDays = await LeagueDayModel.findAll(params);
    res.status(200).send({ leagueDays });
  
  } catch (error) {
    next(error);
    return;
  }
}
