import WebSocket, { WebSocketServer } from "ws";
import CodeExecutionService from "../code_execution/CodeExecutionService";
import { clients } from "..";
import crypto from 'crypto';
import TestCasesRepository from "@/infrastructure/database/repositories/TestCasesRepository";
import SourceCodeHandler from "../code_execution/SourceCodeHandler";
import Queue from "./QueueService";
import SubmissionsRepository from "@/infrastructure/database/repositories/SubmissionsRepository";

interface RealTimeServiceConfig {
    testCasesRepository: TestCasesRepository;
    submissionsRepository: SubmissionsRepository;
    queue: Queue;
};

export default class RealTimeService {
    ws: WebSocketServer;
    config: RealTimeServiceConfig;

    constructor(ws: WebSocketServer, config: RealTimeServiceConfig) {
        this.ws = ws;
        this.config = config;
        this.ws.on("connection", this.onNewConnection);

        const submissionMap: Map<string, boolean> = new Map();
        const firstWrongTestCaseMap: Map<string, TestCaseEntity> = new Map();

        this.config.queue.on('taskCompleted', async (task: SubmissionTask) => {
            // Find Client
            const client = clients.find(c => c.clientId == task.clientId);
            if (!client) {
                return;
            }

            // Check Operation
            if (task.executionPayload.submissionOperation == 'run') {
                const testCase = await this.config.testCasesRepository.getTestCaseById(task.executionPayload.testCaseId);
                if (!testCase) {
                    return;
                }

                const payload: RunOperationResult = { executionResult: task.executionResult, testCase };
                const submissionResult: SubmissionResult = {
                    challengeId: task.executionPayload.challengeId,
                    operation: 'run',
                    payload
                };

                client.send({ service: 'code_execution', payload: submissionResult });
            }

            if (task.executionPayload.submissionOperation == 'submit') {
                if (task.executionPayload.isFirstOne) {
                    submissionMap.set(task.executionPayload.tempSubmissionId, true);
                }

                const testCase = await this.config.testCasesRepository.getTestCaseById(task.executionPayload.testCaseId);
                if (!testCase) {
                    return;
                }

                try {
                    let executionResultOutput = JSON.stringify(JSON.parse(task.executionResult.output));
                    const output = JSON.stringify(JSON.parse(testCase.output));
                    if (output != executionResultOutput) {
                        submissionMap.set(task.executionPayload.tempSubmissionId, false);
                        if (!firstWrongTestCaseMap.get(task.executionPayload.tempSubmissionId)) {
                            firstWrongTestCaseMap.set(task.executionPayload.tempSubmissionId, testCase);
                        }
                    }
                } catch (err) {
                    submissionMap.set(task.executionPayload.tempSubmissionId, false);
                    if (!firstWrongTestCaseMap.get(task.executionPayload.tempSubmissionId)) {
                        firstWrongTestCaseMap.set(task.executionPayload.tempSubmissionId, testCase);
                    }
                }

                if (task.executionPayload.isLastOne) {
                    const isCorrect = submissionMap.get(task.executionPayload.tempSubmissionId);
                    const insertSubmission = await this.config.submissionsRepository.createSubmission({
                        challenge_id: task.executionPayload.challengeId,
                        content: JSON.stringify(task.executionPayload.executionRequest),
                        status: isCorrect ? 'correct' : 'wrong',
                        user_id: 1, // TODO: Change this to actual userId
                    });

                    if (!insertSubmission) {
                        return;
                    }
                    const newSubmission = await this.config.submissionsRepository.getSubmissionById(insertSubmission.insertId);
                    if (!newSubmission) {
                        return;
                    }

                    const payload: SubmitOperationResult = {
                        submission: newSubmission,
                        testCase: firstWrongTestCaseMap.get(task.executionPayload.tempSubmissionId),
                        executionResult: task.executionResult
                    };

                    const submissionResult: SubmissionResult = {
                        challengeId: task.executionPayload.challengeId,
                        operation: 'submit',
                        payload
                    };
                    client.send({ service: 'code_execution', payload: submissionResult });
                    // Remove Submission From Map
                    submissionMap.delete(task.executionPayload.tempSubmissionId);
                    firstWrongTestCaseMap.delete(task.executionPayload.tempSubmissionId);
                }
            }
        });
    }

    onNewConnection = (socket: WebSocket, request: any) => {
        const client = new WebSocketClient(socket, this.config);
        clients.push(client);
    }
}

export class WebSocketClient {
    clientId: string;
    ws: WebSocket;
    config: RealTimeServiceConfig;

    constructor(ws: WebSocket, config: RealTimeServiceConfig) {
        this.ws = ws;
        this.config = config;
        this.clientId = crypto.randomUUID();
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
        this.ws.onopen = this.onOpen;
    }

    onOpen = (event: WebSocket.Event): void => {
        console.log("Client connected");
    }

    onMessage = (event: WebSocket.MessageEvent): void => {
        console.log("Client sent a message");
        try {
            const data = JSON.parse(event.data.toString()) as RealTimeMessage;
            if (data.service == 'code_execution') {
                const submissionRequest = data.payload as SubmissionRequest;
                // TODO: run operation must work with the first 3 test cases only.
                if (submissionRequest.operation == 'run') {
                    this.config.testCasesRepository.getTestCasesByChallengeId(submissionRequest.challengeId).then(testCases => {
                        testCases?.forEach((testCase) => {
                            const payload: ExecutionPayload = {
                                isLastOne: false,
                                isFirstOne: true,
                                challengeId: submissionRequest.challengeId,
                                submissionOperation: 'run',
                                testCaseId: testCase.id!,
                                tempSubmissionId: '',
                                executionRequest: submissionRequest.payload
                            };
                            const codeExecutionService = new CodeExecutionService(this.clientId, payload, this.config.queue);
                            let sourceCode = submissionRequest.payload.sourceCode;
                            const sourceCodeHandler = new SourceCodeHandler({ language: submissionRequest.payload.language, testCase });
                            sourceCode = sourceCodeHandler.getStartOfProgram() + sourceCode + sourceCodeHandler.getCallerWithParams();
                            codeExecutionService.send({ ...submissionRequest.payload, sourceCode });
                        });
                    });
                }

                if (submissionRequest.operation == 'submit') {
                    const tempSubmissionId = crypto.randomUUID();
                    this.config.testCasesRepository.getTestCasesByChallengeId(submissionRequest.challengeId).then(testCases => {
                        testCases?.forEach((testCase, index) => {
                            const payload: ExecutionPayload = {
                                isLastOne: (index == (testCases.length - 1)),
                                isFirstOne: index == 0,
                                submissionOperation: 'submit',
                                testCaseId: testCase.id!,
                                challengeId: submissionRequest.challengeId,
                                tempSubmissionId: tempSubmissionId,
                                executionRequest: submissionRequest.payload
                            };

                            const codeExecutionService = new CodeExecutionService(this.clientId, payload, this.config.queue);
                            let sourceCode = submissionRequest.payload.sourceCode;
                            const sourceCodeHandler = new SourceCodeHandler({ language: submissionRequest.payload.language, testCase });
                            sourceCode = sourceCodeHandler.getStartOfProgram() + sourceCode + sourceCodeHandler.getCallerWithParams();
                            codeExecutionService.send({ ...submissionRequest.payload, sourceCode });
                        });
                    });
                }
            }
        } catch (err) {
            console.log('WebSocketClient', { err });
        }
    }

    onError = (event: WebSocket.ErrorEvent): void => {
        console.log("Client error");

    }

    onClose = (event: WebSocket.CloseEvent): void => {
        console.log("Client closed connection");

    }

    send = (data: RealTimeMessage) => {
        this.ws.send(JSON.stringify(data));
    }
}