import 'dotenv/config';
import 'module-alias/register';
import express from "express";

import { swaggerMiddlewares } from '@/infrastructure/swagger-ui';
import apiRouter from "./routes/index";
import filesServeRouter from "./routes/filesServeRouter";
import RealTimeService, { WebSocketClient } from './services/RealTimeService';
import { WebSocketServer } from 'ws';
import { testCasesRepository, submissionsRepository } from './repositories';
import Queue from './services/QueueService';
import fileUpload from 'express-fileupload';
import cors from "cors";

const PORT = process.env.PORT || 3000;
const WEBSCOKET_SERVER_PORT = process.env.WEBSCOKET_SERVER_PORT ? parseInt(process.env.WEBSCOKET_SERVER_PORT) : 3002;

export const clients: WebSocketClient[] = [];


const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/api-docs', swaggerMiddlewares.swaggerUIServe, swaggerMiddlewares.swaggerUISetup);
app.use('/api', apiRouter);
app.use('/public', filesServeRouter);

const wsServer = new WebSocketServer({ noServer: true }, () => {
    console.log('WebSocketServer at ', WEBSCOKET_SERVER_PORT);
});

const queue = new Queue();
const realTimeService = new RealTimeService(wsServer, { testCasesRepository, submissionsRepository, queue });

export const server = app.listen(PORT, () => {
    console.log(`Server is up running on port ${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (_socket, _request) => {
        wsServer.emit("connection", _socket, _request);
    });
});