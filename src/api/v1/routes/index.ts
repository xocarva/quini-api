import express from 'express';
import { login, register } from '../controllers';
import { leagueDaysRouter } from './leagueDays.router';
import { teamsRouter } from './teams.router';
import * as middlewares from '../../../middlewares';
import { MessageResponse } from '../../../interfaces';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/login', login);
router.post('/register', register);
router.use('/league-days', leagueDaysRouter);
router.use('/teams', teamsRouter);
router.use(middlewares.errorHandler);
router.use(middlewares.notFound);
export default router;

//TODO bets router