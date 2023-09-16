import express from 'express';
import { authControllers } from '../controllers';
import { leagueDaysRouter } from './leagueDaysRouter';
import { teamsRouter } from './teamsRouter';
import { MessageResponse } from '../../../interfaces';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/login', authControllers.login);
router.post('/register', authControllers.register);
router.use('/league-days', leagueDaysRouter);
router.use('/teams', teamsRouter);

export default router;

//TODO bets router