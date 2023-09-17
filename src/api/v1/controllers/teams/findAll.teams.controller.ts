import { NextFunction, Request, Response } from 'express';
import { Team, TeamModel } from '../../models';

export async function findAll(req: Request, res: Response<{ teams: Team[] }>, next: NextFunction) {
  try {
    const params = TeamModel.validateOnePartialWithId(req.query);
    const teams = await TeamModel.findAll(params);
    res.status(200).send({ teams });
  
  } catch (error) {
    next(error);
    return;
  }
}
