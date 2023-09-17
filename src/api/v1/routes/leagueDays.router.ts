import express from 'express';
import { leagueDaysControllers } from '../controllers';

export const leagueDaysRouter = express.Router();

leagueDaysRouter.get('/', leagueDaysControllers.findAll);
leagueDaysRouter.get('/:id', leagueDaysControllers.findOne);
leagueDaysRouter.post('/', leagueDaysControllers.createOne);
leagueDaysRouter.patch('/:id', leagueDaysControllers.updateOne);
leagueDaysRouter.delete('/:id', leagueDaysControllers.deleteOne);
