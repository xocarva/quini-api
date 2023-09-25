import express from 'express';
import { createLeagueDay, deleteOne, getLeagueDay, listLeagueDays, updateLeagueDay } from '../controllers';

export const leagueDaysRouter = express.Router();

leagueDaysRouter.get('/', listLeagueDays);
leagueDaysRouter.get('/:id', getLeagueDay);
leagueDaysRouter.post('/', createLeagueDay);
leagueDaysRouter.patch('/:id', updateLeagueDay);
leagueDaysRouter.delete('/:id', deleteOne);
