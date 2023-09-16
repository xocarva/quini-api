import express from 'express';
import { betsControllers } from '../controllers';

export const betsRouter = express.Router();

betsRouter.post('/', betsControllers.createOne);
