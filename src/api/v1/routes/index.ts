import express from 'express';
import { authRouter } from './authRouter';
import { MessageResponse } from '../../../interfaces';
import { teamsRouter } from './teamsRouter';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', authRouter);
router.use('/teams', teamsRouter);

export default router;
