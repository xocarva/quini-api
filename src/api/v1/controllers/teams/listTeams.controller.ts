import { NextFunction, Request, Response } from 'express';
import { teamService } from '../../services';
import { TeamWithId, partialTeamWithIdSchema } from '../../schemas';

export async function listTeams(req: Request, res: Response<{ teams: TeamWithId[] }>, next: NextFunction) {
  try {
    const params = partialTeamWithIdSchema.parse(req.query);
    const teams = await teamService.getAll(params);

    res.status(200);
    res.send({ teams });
  
  } catch (error) {
    next(error);
    return;
  }
}
