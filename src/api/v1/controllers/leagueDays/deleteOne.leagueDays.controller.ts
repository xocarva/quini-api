import { NextFunction, Request, Response } from 'express';
import { LeagueDayModel } from '../../models';

export async function deleteOne(req: Request, res: Response<{ message: string }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const leagueDay = await LeagueDayModel.findOne({ id });

    if (!leagueDay) {
      res.status(404);
      throw new Error('League day not found');
    }

    const deleted = !!await LeagueDayModel.deleteOne(id);

    if (!deleted) {
      res.status(500);
      throw new Error('League day could not be deleted');
    }

    res.status(200);
    res.send({
      message: `League day ${leagueDay.leagueDayNumber} from season ${leagueDay.season} has been deleted`,
    });

  } catch (error) {
    next(error);
    return;
  }
}
