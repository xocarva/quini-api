import { NextFunction, Request, Response } from 'express';
import { teamService } from '../../services';
import { Team, teamSchema } from '../../schemas';

export async function createTeam(req: Request<Team>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const team = teamSchema.parse(body);
    const { id } = await teamService.createOne(team);

    res.status(201);
    res.send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
