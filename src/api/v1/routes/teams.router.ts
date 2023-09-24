import express from 'express';
import { createTeam, deleteTeam, getTeam, listTeams, updateOne } from '../controllers';

export const teamsRouter = express.Router();

teamsRouter.get('/:id', getTeam);
teamsRouter.get('/', listTeams);
teamsRouter.post('/', createTeam);
teamsRouter.patch('/:id', updateOne);
teamsRouter.delete('/:id', deleteTeam);
