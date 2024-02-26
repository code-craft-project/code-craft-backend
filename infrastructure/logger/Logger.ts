import { LoggerInterface } from "@/domain/LoggerInterface";

const reset = "\x1b[0m";

const print = {
    green: (text: string): void => console.log("\x1b[32m" + text + reset),
    red: (text: string): void => console.log("\x1b[31m" + text + reset),
    blue: (text: string): void => console.log("\x1b[34m" + text + reset),
    yellow: (text: string): void => console.log("\x1b[33m" + text + reset),
};

export default class Logger implements LoggerInterface {
    log(text: string): void {
        console.log(text);
    }

    error(text: string): void {
        print.red(text);
    }

    success(text: string): void {
        print.green(text);
    }

    info(text: string): void {
        print.blue(text);
    }

    warn(text: string): void {
        print.yellow(text);
    }
};