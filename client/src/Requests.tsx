import OpenAI from "openai";
import {Tests} from "./TestViewer.tsx";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const MODEL_ID = "gpt-3.5-turbo";
const DEFAULT_LANGUAGE = "python";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

async function completionRequest(instructions: string, prompt: string) {
    const result = await openai.chat.completions.create({
        model: MODEL_ID,
        messages: [
            {
                role: "system",
                content: instructions,
            },
            {
                role: "user",
                content: prompt,
            }
        ],
    });

    return result.choices[0].message.content;
}

export type FunctionTypes = {
    inputTypes: { name: string, type: string }[];
    outputType: (string | null);
}

async function getTypes(prompt: string, language: string = DEFAULT_LANGUAGE): Promise<FunctionTypes | null> {
    const instructions: string = `
    You will be given a textual description of a function, reply with the corresponding named input and output types in 
    ${language}, exactly as they would appear in code, separated by line breaks. You do not need to name the output. If 
    the function does not take any inputs or does not return any outputs, use the word "none". For example, if the function "getNameLength" takes in a string 
    and returns an integer, reply with "name: string\ninteger". If the function "myFunction" takes in a string and an 
    integer and returns a string, reply with "x1: string\nx2: integer\nstring". If the function takes in no inputs and 
    returns no outputs, reply with "none\nnone". If the function "getDistance" takes two tuples of floats and returns a 
    float, reply with "pos1: (float, float)\npos2: (float, float)\nfloat".
    `.trim();

    let result = await completionRequest(instructions, prompt)

    if (result) {
        let lines = result.split("\n");
        let inputLines = lines.slice(0, lines.length - 1);
        let outputLine = lines[lines.length - 1];

        let inputTypes: { name: string, type: string }[] = [];

        for (let line of inputLines) {
            if (line !== "none") {
                let [name, ...type] = line.split(": ");
                inputTypes.push({name: name, type: type.join(": ")});
            }
        }

        let outputType = outputLine === "none" ? null : outputLine;

        return {inputTypes: inputTypes, outputType: outputType};
    } else {
        return null;
    }
}

async function getFunction(prompt: string, types: FunctionTypes, language: string = DEFAULT_LANGUAGE): Promise<(string | null)> {
    const instructions: string = `
    You will be given a textual description of a function, reply with its implementation in ${language}. Only reply with
    the function, do not add any other text.
    `.trim();

    let inputTypePrompt =
        types.inputTypes.length === 0 ?
            ("It takes no inputs.") :
            ("As inputs, it takes: " + types.inputTypes.map(({name, type}) => {
                return name + ": " + type
            }).join("\n") + "\n\n");
    let outputTypePrompt = types.outputType === null ? ("It returns no outputs.") : ("It returns " + types.outputType + " as an output.");

    const typedPrompt: string = `
    ${prompt}
    
    ${inputTypePrompt}
    ${outputTypePrompt}
    `.trim();

    return await completionRequest(instructions, prompt);
}

async function getTests(prompt: string, types: FunctionTypes, func: String, language: string = DEFAULT_LANGUAGE): Promise<Tests | null> {
    const instructions: string = `
    You will be given a textual description of a function, reply with a list of test cases in ${language} that test the 
    function. Each test case should be a function that takes in no arguments and returns a boolean. If the test passes, 
    the function should return true. If the test fails, the function should return false. For example, if the function 
    "getNameLength" takes in a string and returns an integer, reply with "def testGetNameLength():\n\treturn getNameLength("hello") == 5".
    `.trim();

    const fieldNames = Array.from(types.inputTypes.keys());

    let result = await completionRequest(instructions, prompt);

    // if (result) {
    //     let lines = result.split("\n");
    //     let tests = lines.map((line) => {
    //         return {
    //             inputs: [],
    //             output: "",
    //             result: null,
    //         }
    //     });
    //
    //     return {testCases: tests, inputFieldNames: fieldNames};
    // } else {
    //     return null;
    // }

    return null;
}

export {getTypes, getFunction, getTests};