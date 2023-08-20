import { NextFunction, Request, Response } from 'express';
import { TeamModel } from '../../models';

export async function deleteOne(req: Request, res: Response<{ message: string }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const team = await TeamModel.findOne({ id });

    if (!team) {
      res.status(404);
      throw new Error('Team not found');
    }

    const deleted = !!await TeamModel.deleteOne(id);

    if (!deleted) {
      res.status(500);
      throw new Error('Team could not be deleted');
    }

    res.status(200);
    res.send({ message: `Team ${team.name} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
