import { NextFunction, Request, Response } from 'express';
import { TeamModel, TeamWithId } from '../../models';

export async function updateOne(req: Request, res: Response<{ team: TeamWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const existingTeam = await TeamModel.findOne({ id });

    if (!existingTeam) {
      res.status(404);
      throw new Error('Team not found');
    }

    const updatedData = TeamModel.validateOnePartial(body);

    const { name } = updatedData;

    if (name) {
      const existingTeamWithThisName = await TeamModel.findOne({ name });

      if (existingTeamWithThisName && existingTeamWithThisName.id === id) {
        res.status(409);
        throw new Error(`Name ${updatedData.name} is already in use`);
      }
    }

    const updated = !!await TeamModel.updateOne(id, updatedData);

    if (!updated) {
      res.status(200).send({ team: existingTeam });
      return;
    }
    
    res.status(200).send({ team: { ...existingTeam, ...updatedData  } });

  } catch (error) {
    next(error);
  }
}
