import 'dotenv/config';
import 'module-alias/register';
import express from "express";

import { swaggerMiddlewares } from '@/infrastructure/swagger-ui';
import apiRouter from "./routes/index";
import RealTimeService, { WebSocketClient } from './services/RealTimeService';
import { WebSocketServer } from 'ws';
import { testCasesRepository, submissionsRepository } from './repositories';
import Queue from './services/QueueService';

const PORT = process.env.PORT || 3000;
const WEBSCOKET_SERVER_PORT = process.env.WEBSCOKET_SERVER_PORT ? parseInt(process.env.WEBSCOKET_SERVER_PORT) : 3002;

export const clients: WebSocketClient[] = [];


const app = express();

app.use(express.json());

app.use('/api-docs', swaggerMiddlewares.swaggerUIServe, swaggerMiddlewares.swaggerUISetup);
app.use('/api', apiRouter);



const wsServer = new WebSocketServer({ port: WEBSCOKET_SERVER_PORT }, () => {
    console.log('WebSocketServer at ', WEBSCOKET_SERVER_PORT);
});

const queue = new Queue();
const realTimeService = new RealTimeService(wsServer, { testCasesRepository, submissionsRepository, queue });

export const server = app.listen(PORT, () => {
    console.log(`Server is up running on port ${PORT}`);
});