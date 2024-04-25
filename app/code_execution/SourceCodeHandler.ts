interface SourceCodeHandlerConfig {
    language: SupportedLanguages;
    testCase: TestCaseEntity;
};

export default class SourceCodeHandler {
    config: SourceCodeHandlerConfig;

    constructor(config: SourceCodeHandlerConfig) {
        this.config = config;
    }

    getCallerWithParams(): string {
        switch (this.config.language) {
            case 'javascript':
                {
                    let params = '(';
                    this.config.testCase.inputs?.forEach((input, index) => {
                        if (input.type == 'string') {
                            params += '"';
                        }
                        params += input.input;
                        if (input.type == 'string') {
                            params += '"';
                        }
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return '\n\nmain' + params;
                }
            case 'c':
                {
                    let params = '(';
                    this.config.testCase.inputs?.forEach((input, index) => {
                        if (input.type == 'string') {
                            params += '"';
                        }
                        params += input.input;
                        if (input.type == 'string') {
                            params += '"';
                        }
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return '\n\nint main(){\nstart' + params + ';\treturn 0; }\n\n';
                }
            case 'c++':
                {
                    let params = '(';
                    this.config.testCase.inputs?.forEach((input, index) => {
                        if (input.type == 'string') {
                            params += '"';
                        }
                        params += input.input;
                        if (input.type == 'string') {
                            params += '"';
                        }
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return '\n\nint main(){\nauto program = Program();\nprogram.run' + params + ';\nreturn 0;\n}\n\n';
                }
            case 'php':
                {
                    let params = '(';
                    this.config.testCase.inputs?.forEach((input, index) => {
                        if (input.type == 'string') {
                            params += '"';
                        }
                        params += input.input;
                        if (input.type == 'string') {
                            params += '"';
                        }
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return '\n\n<?php main' + params + '; ?>';
                }
            case 'python':
                {
                    let params = '(';
                    this.config.testCase.inputs?.forEach((input, index) => {
                        if (input.type == 'string') {
                            params += '"';
                        }
                        params += input.input;
                        if (input.type == 'string') {
                            params += '"';
                        }
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return '\n\nmain' + params;
                }
        }

        return '';
    }

    getStartOfProgram(): string {
        switch (this.config.language) {
            case 'c':
                return '#include <stdio.h>\n\n';
            case 'c++':
                return '#include <iostream>\n\n';
        }

        return '';
    }
}