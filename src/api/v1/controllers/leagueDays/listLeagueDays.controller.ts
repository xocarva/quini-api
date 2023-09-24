import { NextFunction, Request, Response } from 'express';
import { leagueDaysService } from '../../services';
import { CompleteLeagueDayWithId, partialLeagueDayWithIdSchema } from '../../schemas';

export async function listLeagueDays(req: Request, res: Response<{ leagueDays: CompleteLeagueDayWithId[] }>, next: NextFunction) {
  try {
    const params = partialLeagueDayWithIdSchema.parse(req.query);
    const leagueDays = await leagueDaysService.getAll(params);
    res.status(200);
    res.send({ leagueDays });

  } catch (error) {
    next(error);
  }
}

