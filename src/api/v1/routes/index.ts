import express from 'express';
import { teamsRouter } from './teamsRouter';
import { authControllers } from '../controllers';
import { MessageResponse } from '../../../interfaces';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});


router.post('/register', authControllers.register);
router.get('/login', authControllers.login);
router.use('/teams', teamsRouter);

export default router;
