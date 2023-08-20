import { NextFunction, Request, Response } from 'express';
import { Team, TeamModel } from '../../models';

export async function createOne(req: Request<Team>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const team = TeamModel.validateOne(body);
    const { name } = team;
    const teamNameExists = !!await TeamModel.findOne({ name });
  
    if (teamNameExists) {
      res.status(409);
      throw new Error(`Team name ${name} already exists`);
    }
  
    const { id } = await TeamModel.createOne(team);
    res.status(201).send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
