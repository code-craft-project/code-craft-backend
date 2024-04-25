import EventEmitter from 'events';

export default class Queue extends EventEmitter {
    queue: any[];
    isProcessing: boolean;

    constructor() {
        super();
        this.queue = [];
        this.isProcessing = false;
    }

    enqueue(task: any) {
        this.queue.push(task);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            this.emit('empty'); // Emit event when the queue becomes empty
            return;
        }

        this.isProcessing = true;
        const task = this.queue.shift();
        // Process the task here
        console.log('Processing task:', task);
        // Simulate asynchronous processing
        console.log('Task completed:', task);
        // Emit event when the task is completed
        this.emit('taskCompleted', task);
        // Continue processing the next task
        this.processQueue();
    }
}