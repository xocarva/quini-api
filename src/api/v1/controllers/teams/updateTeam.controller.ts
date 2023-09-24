import { NextFunction, Request, Response } from 'express';
import { teamService } from '../../services';
import { TeamWithId, teamSchema } from '../../schemas';

export async function updateOne(req: Request, res: Response<{ team: TeamWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = teamSchema.parse(body);
    const team = await teamService.updateOne(id, updateData);

    res.status(200);
    res.send({ team });
  
  } catch (error) {
    next(error);
  }
}
