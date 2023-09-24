import express from 'express';
import { createLeagueDay, deleteOne, getLeagueDay, listLeagueDays, updateOne } from '../controllers';

export const leagueDaysRouter = express.Router();

leagueDaysRouter.get('/', listLeagueDays);
leagueDaysRouter.get('/:id', getLeagueDay);
leagueDaysRouter.post('/', createLeagueDay);
leagueDaysRouter.patch('/:id', updateOne);
leagueDaysRouter.delete('/:id', deleteOne);
