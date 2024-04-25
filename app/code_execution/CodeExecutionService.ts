import net from 'net';
import Queue from '../services/QueueService';

const EXECUTION_SERVICE_PORT = process.env.EXECUTION_SERVICE_PORT ? parseInt(process.env.EXECUTION_SERVICE_PORT) : 3001;

export default class CodeExecutionService {
    client: net.Socket;
    clientId: string;
    payload: ExecutionPayload;
    queue: Queue;

    constructor(clientId: string, payload: ExecutionPayload, queue: Queue) {
        this.clientId = clientId;
        this.payload = payload;
        this.queue = queue;

        this.client = net.createConnection({ port: EXECUTION_SERVICE_PORT }, () => {
            console.log('Connected to server at ', EXECUTION_SERVICE_PORT);
        });

        this.client.on('data', this.onReceive);
        this.client.on('end', this.onEnd);
        this.client.on('error', (err) => { console.log('CodeExecutionService', err); });
    }

    onReceive = (data: Buffer): void => {
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

    send = (request: ExecutionRequest) => {
        // console.log({ request });
        this.client.write(JSON.stringify(request));
    }
}