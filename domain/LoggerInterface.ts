export interface LoggerInterface {
    log: (text: string) => void;
    warn: (text: string) => void;
    error: (text: string) => void;
    info: (text: string) => void;
    success: (text: string) => void;
}