import { NextFunction, Request, Response } from 'express';
import { leagueDaysService } from '../../services';
import { LeagueDay, leagueDaySchema } from '../../schemas';

export async function createLeagueDay(req: Request<LeagueDay>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const leagueDay = leagueDaySchema.parse(body);
    const { id } = await leagueDaysService.createOne(leagueDay);

    res.status(201);
    res.send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
