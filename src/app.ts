import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import api from './api/v1';

const { routes, middlewares } = api;

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
