import express from 'express';
import { betsControllers } from '../controllers';

export const betsRouter = express.Router();

betsRouter.get('/', betsControllers.findAll);
betsRouter.get('/:id', betsControllers.findOne);
betsRouter.post('/', betsControllers.createOne);
betsRouter.patch('/:id', betsControllers.updateOne);
betsRouter.delete('/:id', betsControllers.deleteOne);
