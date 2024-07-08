import { WebSocket, RawData } from 'ws';
import Queue from '../services/QueueService';

const EXECUTION_SERVICE_PORT = process.env.EXECUTION_SERVICE_PORT ? parseInt(process.env.EXECUTION_SERVICE_PORT) : 3001;

export default class CodeExecutionService {
    client: WebSocket;
    clientId: string;
    payload: ExecutionPayload;
    queue: Queue;

    constructor(clientId: string, payload: ExecutionPayload, queue: Queue) {
        this.clientId = clientId;
        this.payload = payload;
        this.queue = queue;

        EXECUTION_SERVICE_PORT;
        // localhost:${EXECUTION_SERVICE_PORT}
        this.client = new WebSocket(`ws://code-execution.onrender.com`);
        this.client.onopen = () => {
            console.log('Connected to code-execution service at ', EXECUTION_SERVICE_PORT);
        }

        this.client.on('message', this.onReceive);
        this.client.on('close', this.onEnd);
        this.client.on('error', (err) => { console.log('CodeExecutionService', err); });
    }

    onReceive = (data: RawData): void => {
        try {
            // console.log('Received:', data.toString());
            const executionResult = JSON.parse(data.toString()) as ExecutionResult;
            const submissionTask: SubmissionTask = {
                clientId: this.clientId,
                executionResult,
                executionPayload: this.payload,
            };
            this.queue.enqueue(submissionTask);
        } catch (err) {
            console.log("error:", err);
        }

    }

    onEnd = (): void => {
        console.log('Disconnected from server');
    }

    send = async (request: ExecutionRequest) => {
        // console.log({ request });
        const promise = new Promise((resolve, reject) => { this.client.onopen = () => { resolve(true); } });
        await promise;
        this.client.send(JSON.stringify(request));
    }
}