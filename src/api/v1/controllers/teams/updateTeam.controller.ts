import { NextFunction, Request, Response } from 'express';
import { teamsService } from '../../services';
import { TeamWithId, teamSchema } from '../../schemas';

export async function updateTeam(req: Request, res: Response<{ team: TeamWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = teamSchema.parse(body);
    const team = await teamsService.updateOne(id, updateData);

    res.status(200);
    res.send({ team });
  
  } catch (error) {
    next(error);
  }
}
