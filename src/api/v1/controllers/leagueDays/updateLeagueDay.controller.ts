import { NextFunction, Request, Response } from 'express';
import { leagueDaysService } from '../../services';
import { LeagueDayWithId, partialLeagueDaySchema } from '../../schemas';

export async function updateLeagueDay(req: Request, res: Response<{ leagueDay: LeagueDayWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = partialLeagueDaySchema.parse(body);
    const leagueDay = await leagueDaysService.updateOne(id, updateData);

    res.status(200);
    res.send({ leagueDay });
  
  } catch (error) {
    next(error);
  }
}
