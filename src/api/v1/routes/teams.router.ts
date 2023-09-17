import express from 'express';
import { teamControllers } from '../controllers';

export const teamsRouter = express.Router();

teamsRouter.get('/', teamControllers.findAll);
teamsRouter.get('/:id', teamControllers.findOne);
teamsRouter.post('/', teamControllers.createOne);
teamsRouter.patch('/:id', teamControllers.updateOne);
teamsRouter.delete('/:id', teamControllers.deleteOne);
