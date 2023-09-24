import { NextFunction, Request, Response } from 'express';
import { teamsService } from '../../services';
import { TeamWithId } from '../../schemas';

export async function getTeam(req: Request, res: Response<{ team: TeamWithId }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const team = await teamsService.getOne({ id });

    if (team) {
      res.status(200);
      res.send({ team });
    }

  } catch (error) {
    next(error);
  }
}
