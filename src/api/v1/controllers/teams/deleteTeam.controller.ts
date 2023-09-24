import { NextFunction, Request, Response } from 'express';
import { teamService } from '../../services';

export async function deleteTeam(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    await teamService.deleteOne(id);

    res.status(200);
    res.send({ message: `Team with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
