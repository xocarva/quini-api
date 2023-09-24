import express from 'express';
import { createTeam, deleteTeam, getTeam, listTeams, updateTeam } from '../controllers';

export const teamsRouter = express.Router();

teamsRouter.get('/:id', getTeam);
teamsRouter.get('/', listTeams);
teamsRouter.post('/', createTeam);
teamsRouter.patch('/:id', updateTeam);
teamsRouter.delete('/:id', deleteTeam);
