import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_ID = "gpt-3.5-turbo";
const DEFAULT_LANGUAGE = "python";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
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

async function getTypes(prompt: string, language: string = DEFAULT_LANGUAGE) {
    const instructions: string = `
    You will be given a textual description of a function, reply with the corresponding input and output types in 
    ${language}, separated by a line break. If there are multiple input types, separate them with commas. If the 
    function does not take any inputs or does not return any outputs, use the word "none". For example, if the function 
    takes in a string and returns an integer, reply with "string\ninteger". If the function takes in a string and an 
    integer and returns a string, reply with "string, integer\nstring". If the function takes in no inputs and returns 
    no outputs, reply with "none\nnone".
    `.trim();

    let result = await completionRequest(instructions, prompt)

    if (result) {
        let types = result.split("\n");
        return types.map((type) => {if (type === "none") return null; else return type})
    } else {
        return null;
    }
}

async function getFunction(prompt: string, types: (string | null)[], language: string = DEFAULT_LANGUAGE) {
    const instructions: string = `
    You will be given a textual description of a function, reply with its implementation in ${language}.".
    `.trim();

    let stringTypes = types.map((type) => {if (type === null) return "none"; else return type});

    const typedPrompt: string = `
    ${prompt}
    
    Input type(s): ${stringTypes[0]}
    Output type(s): ${stringTypes[1]}
    `.trim();

    return await completionRequest(instructions, prompt);
}

export { getTypes, getFunction };