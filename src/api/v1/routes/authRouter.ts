import express from 'express';
import { authControllers } from '../controllers';

export const authRouter = express.Router();

authRouter.post('/register', authControllers.register);
authRouter.get('/login', authControllers.login);
