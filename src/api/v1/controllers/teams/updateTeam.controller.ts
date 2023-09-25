import { NextFunction, Request, Response } from 'express';
import { teamsService } from '../../services';
import { TeamWithId, partialTeamSchema } from '../../schemas';

export async function updateTeam(req: Request, res: Response<{ team: TeamWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = partialTeamSchema.parse(body);
    const team = await teamsService.updateOne(id, updateData);

    res.status(200);
    res.send({ team });
  
  } catch (error) {
    next(error);
  }
}
