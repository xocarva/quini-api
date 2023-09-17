import { NextFunction, Request, Response } from 'express';
import { LeagueDay, LeagueDayModel } from '../../models';

export async function createOne(req: Request<LeagueDay>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const leagueDay = LeagueDayModel.validateOne(body);
    const { season, leagueDayNumber } = leagueDay;
    const leagueDayExists = !!await LeagueDayModel.findOne({ season, leagueDayNumber });
  
    if (leagueDayExists) {
      res.status(409);
      throw new Error(`League day ${leagueDayNumber} for season ${leagueDayNumber} already exists`);
    }
  
    const { id } = await LeagueDayModel.createOne(leagueDay);
    res.status(201).send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
