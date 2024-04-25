type RealTimeService = 'code_execution';

interface RealTimeMessage {
    service: RealTimeService;
    payload: any;
};