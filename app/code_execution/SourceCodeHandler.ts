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
                    const parsedArgs = this.parseArgsForCAndCpp(this.config.testCase.inputs || []);

                    let params = '(';
                    this.config.testCase.inputs?.forEach((_, index) => {
                        params += `arg${index}`;
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ', '
                        }
                    });
                    params += ')';
                    return `\n\nint main(){\n${parsedArgs}\n\nstart${params};\nreturn 0; }\n\n`;
                }
            case 'c++':
                {
                    const parsedArgs = this.parseArgsForCAndCpp(this.config.testCase.inputs || []);

                    let params = '(';
                    this.config.testCase.inputs?.forEach((_, index) => {
                        params += `arg${index}`;
                        if (index != this.config.testCase.inputs!.length - 1) {
                            params += ','
                        }
                    });
                    params += ')';
                    return `\n\nint main(){\nauto program = Program();\n${parsedArgs}\nprogram.run${params};\nreturn 0;\n}\n\n`;
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
                return '#include <stdio.h>\n#include <stdbool.h>\n\n';
            case 'c++':
                return '#include <iostream>\n#include <stdbool.h>\n\n';
        }

        return '';
    }

    parseArgsForCAndCpp(inputs: TestCaseInputEntity[]): string {
        let paramsDeclaration = "";
        inputs.forEach((input, index) => {
            if (input.type == "string") {
                let param = `char* arg${index} = "${input.input}";\n`;
                paramsDeclaration += param;
            }
            if (input.type == "number") {
                let param = `int arg${index} = "${input.input}";\n`;
                paramsDeclaration += param;
            }
            if (input.type == "boolean") {
                let param = `bool arg${index} = "${input.input}";\n`;
                paramsDeclaration += param;
            }

            if (input.type == "array_of_strings") {
                let param = `char* arg${index}[] = {`;
                const arr = JSON.parse(input.input) as Array<string>;
                arr.forEach((value, arrIndex) => {
                    param += `"${value}"`;
                    if (arrIndex != (arr.length - 1)) {
                        param += ', ';
                    }
                });
                param += "};\n";
                paramsDeclaration += param;
            }

            if (input.type == "array_of_numbers") {
                let param = `int arg${index}[] = {`;
                const arr = JSON.parse(input.input) as Array<string>;
                arr.forEach((value, arrIndex) => {
                    param += `${value}`;
                    if (arrIndex != (arr.length - 1)) {
                        param += ', ';
                    }
                });
                param += "};\n";
                paramsDeclaration += param;
            }

            if (input.type == "array_of_booleans") {
                let param = `bool arg${index}[] = {`;
                const arr = JSON.parse(input.input) as Array<string>;
                arr.forEach((value, arrIndex) => {
                    param += `${value}`;
                    if (arrIndex != (arr.length - 1)) {
                        param += ', ';
                    }
                });
                param += "};\n";
                paramsDeclaration += param;
            }
        });

        return paramsDeclaration;
    }
}