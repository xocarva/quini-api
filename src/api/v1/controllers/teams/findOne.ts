import { NextFunction, Request, Response } from 'express';
import { Team, TeamModel } from '../../models';

export async function findOne(req: Request, res: Response<{ team: Team }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const team = await TeamModel.findOne({ id });

    if (!team) {
      res.status(404);
      throw new Error('Team not found');
    }

    res.status(200).send({ team });

  } catch (error) {
    next(error);
  }
}
