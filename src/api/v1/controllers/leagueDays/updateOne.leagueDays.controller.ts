import { NextFunction, Request, Response } from 'express';
import { LeagueDayModel, LeagueDayWithId } from '../../models';

export async function updateOne(req: Request, res: Response<{ leagueDay: LeagueDayWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const existingLeagueDay = await LeagueDayModel.findOne({ id });

    if (!existingLeagueDay) {
      res.status(404);
      throw new Error('League day not found');
    }

    const updatedData = LeagueDayModel.validateOnePartial(body);

    const { leagueDayNumber } = updatedData;

    if (leagueDayNumber) {
      const existingTeamWithThisLeagueDayNumber = await LeagueDayModel.findOne({ leagueDayNumber });

      if (existingTeamWithThisLeagueDayNumber
          && existingTeamWithThisLeagueDayNumber.season === existingLeagueDay.season
          && existingTeamWithThisLeagueDayNumber.id !== id
      ) {
        res.status(409);
        throw new Error(`League day number ${leagueDayNumber} for season ${existingLeagueDay.season} already exists`);
      }
    }

    const updated = !!await LeagueDayModel.updateOne(id, updatedData);

    if (!updated) {
      res.status(200).send({ leagueDay: existingLeagueDay });
      return;
    }

    const updatedLeagueDay = await LeagueDayModel.findOne({ id });
    
    if (!updatedLeagueDay) {
      res.status(500);
      throw new Error('League day was updated but cannot be retrieved');
    }

    res.status(200).send({ leagueDay: updatedLeagueDay });

  } catch (error) {
    next(error);
  }
}
