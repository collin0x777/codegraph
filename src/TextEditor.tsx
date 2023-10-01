import React, {useEffect, useState} from 'react';
import {Group, Rect} from 'react-konva';
import EditableTextBox from './EditableTextBox';
import {
    CustomAnimatedBuildButton, CustomAnimatedDropdownButton,
    CustomAnimatedTableButton, CustomCodeButton,
    CustomMenuButton,
    CustomXButton
} from "./CustomButtons.tsx";
import {DraggableOutlet, WatchfulInlet} from "./InletOutlet.tsx";
import BorderedLogViewer from "./LogViewer.tsx";
import {FunctionTypes, getFunction, getTests, getTypes} from "./Requests.tsx";
import TestViewer, {Tests} from "./TestViewer.tsx";
import CodeViewer from "./CodeViewer.tsx";

export type EditorState = {
    id: number;
    ref: React.MutableRefObject<any>;
    x: number;
    y: number;
    width: number;
    height: number;
    inletRef: React.MutableRefObject<any>;
    prompt: string;
    types: FunctionTypes | null;
    code: string | null;
    tests: Tests | null;
    logs: string[];
}

export function defaultEditorState(id: number, x: number, y: number): EditorState {
    return {
        id: id,
        ref: React.createRef<any>(),
        x: x,
        y: y,
        width: 400,
        height: 200,
        inletRef: React.createRef<any>(),
        prompt: "",
        types: null,
        code: null,
        tests: null,
        logs: []
    }
}

type TextEditorProps = {
    editor: EditorState,
    deleteEditor: () => void;
    updateEditor: (transform: (editor: EditorState) => EditorState) => void;
    attemptConnection: (x: number, y: number) => void;
};

const getCurrentTimeAsString = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

const TextEditor: React.FC<TextEditorProps> = ({editor, deleteEditor, updateEditor, attemptConnection}) => {
    const [bottomPanel, setBottomPanel] = useState<number>(0); // 0 = no panel, 1 = log panel, 2 = test panel, 3 = code panel
    const [buildStatus, setBuildStatus] = useState<number>(0); // 0 = not built, 1 = building, 2 = built successfully, 3 = build failed
    const [testStatus, setTestStatus] = useState<number>(0); // 0 = not tested, 1 = testing, 2 = tested successfully, 3 = test failed

    const BUTTON_SIZE = 25;
    const BUTTON_MARGIN = 15;
    const BUTTON_SPACING = 50;
    const BUTTON_Y = editor.height - (BUTTON_MARGIN + BUTTON_SIZE)
    const INLET_OUTLET_OVERLAP = 5;

    const setTypes = (types: FunctionTypes | null) => {
        updateEditor((oldEditor: EditorState) => {
            return {...oldEditor, types: types}
        })
    }
    const setCode = (code: string | null) => {
        updateEditor(oldEditor => {
            return {...oldEditor, code: code}
        })
    }
    const setTests = (tests: Tests | null) => {
        updateEditor(oldEditor => {
            return {...oldEditor, tests: tests}
        })
    }
    const setPrompt = (prompt: string) => {
        updateEditor(oldEditor => {
            return {...oldEditor, prompt: prompt}
        })
    }

    function log(str: string) {
        updateEditor(oldEditor => {
            return {...oldEditor, logs: [...oldEditor.logs, `[${getCurrentTimeAsString()}] ${str}`]}
        });
    }

    useEffect(() => {
        let tests = editor.tests;
        if (tests) {
            if (tests.testCases.find(testCase => testCase.result !== null && testCase.result !== testCase.output)) {
                setTestStatus(3);
            } else if (tests.testCases.find(testCase => testCase.result === null)) {
                setTestStatus(1);
            } else {
                setTestStatus(2);
            }
        }
    }, [editor.tests, editor.tests?.testCases, editor.tests?.testCases.length])

    const buildFunction = async () => {
        log('Building function...');
        setBuildStatus(1);
        setBottomPanel(1);
        try {
            const types = (await getTypes(editor.prompt))!;
            setTypes(types)

            log('Got types!');
            const inputTypes: string[] = types.inputTypes.map((input) => input.type);

            log(`Input type(s): (${inputTypes.join(', ')})`);
            log(`Output types: ${types.outputType}`);

            const generatedFunction = (await getFunction(editor.prompt, types))!;
            log('Generated function!');
            setCode(generatedFunction);
            setBuildStatus(2);
        } catch (error) {
            log(`Error occurred when building: ${error}`);
            setBuildStatus(3);
        }
    }

    const generateTests = async () => {
        log('Generating test cases...');
        try {
            const tests = (await getTests(editor.prompt, editor.types!, editor.code!))!;
            setTests(tests);
            log(`Generated ${tests.testCases.length} tests!`);
        } catch (error) {
            log(`Error occurred when generating tests: ${error}`);
        }
    }

    const handleBuildButtonClick = async () => {
        await buildFunction();
        await generateTests()
    }

    const handleDropdownButtonClick = () => {
        setBottomPanel((bottomPanel === 1) ? 0 : 1);
        updateEditor((oldEditor: EditorState) => {
            return {...oldEditor, height: 200, width: 400}
        })
    };

    const handleMenuButtonClick = () => {
        // Handle menu button click
        setTests({
            testCases: [
                {
                    inputs: ["1", "2", "3"],
                    output: "6",
                    result: "6"
                },
                {
                    inputs: ["4", "5", "6"],
                    output: "15",
                    result: null,
                },
                {
                    inputs: ["7", "8", "9"],
                    output: "24",
                    result: "25",
                }
            ],
            inputFieldNames: ["a", "b", "c"]
        });
    };

    const handleCodeButtonClick = () => {
        setBottomPanel((bottomPanel === 3) ? 0 : 3);
    }

    const handleTableButtonClick = () => {
        setBottomPanel((bottomPanel === 2) ? 0 : 2);
    }

    return (
        <Group width={editor.width} height={editor.height}>
            <Rect
                x={5}
                y={5}
                width={editor.width - 10}
                height={editor.height - 10}
                fill="#76949F"
                stroke="#86BBBD"
                strokeWidth={10}
            />
            <EditableTextBox
                text={editor.prompt}
                x={20}
                y={20}
                width={editor.width - 40}
                height={editor.height - 80}
                onChange={(text) => setPrompt(text)}
            />
            {(editor.types && editor.types.inputTypes.length > 0) ? (
                <WatchfulInlet x={INLET_OUTLET_OVERLAP} y={editor.height / 2} size={BUTTON_SIZE}
                               inletRef={editor.inletRef} inputTypes={editor.types.inputTypes}/>
            ) : null}
            {(editor.types && editor.types.outputType) ? (
                <DraggableOutlet x={editor.width - INLET_OUTLET_OVERLAP} y={editor.height / 2} size={BUTTON_SIZE}
                                 attemptConnection={attemptConnection} outputType={editor.types.outputType}/>
            ) : null}

            {(bottomPanel === 1) ? (
                <Group y={editor.height}>
                    <BorderedLogViewer logs={editor.logs} width={editor.width} height={100}/>
                </Group>
            ) : null}

            {(bottomPanel === 2) ? (
                <Group y={editor.height}>
                    <TestViewer tests={editor.tests} width={editor.width} height={100}/>
                </Group>
            ) : null}

            {(bottomPanel === 3) ? (
                <Group y={editor.height}>
                    <CodeViewer code={editor.code} width={editor.width} height={100}/>
                </Group>
            ) : null}

            <CustomAnimatedBuildButton x={BUTTON_MARGIN} y={BUTTON_Y} size={BUTTON_SIZE}
                                       onClick={handleBuildButtonClick} status={buildStatus}/>
            <CustomAnimatedDropdownButton x={BUTTON_MARGIN + BUTTON_SPACING} y={BUTTON_Y} size={BUTTON_SIZE}
                                  onClick={handleDropdownButtonClick} status={(bottomPanel === 1) ? 1 : 0}/>
            <CustomMenuButton x={BUTTON_MARGIN + (2 * BUTTON_SPACING)} y={BUTTON_Y} size={BUTTON_SIZE}
                              onClick={handleMenuButtonClick}/>
            <CustomCodeButton x={BUTTON_MARGIN + (3 * BUTTON_SPACING)} y={BUTTON_Y} size={BUTTON_SIZE}
                              onClick={handleCodeButtonClick}/>
            <CustomAnimatedTableButton x={BUTTON_MARGIN + (4 * BUTTON_SPACING)} y={BUTTON_Y} size={BUTTON_SIZE}
                                       onClick={handleTableButtonClick}
                                       status={testStatus}/>
            <CustomXButton x={editor.width - (BUTTON_MARGIN + BUTTON_SIZE)} y={BUTTON_Y} size={BUTTON_SIZE}
                           onClick={deleteEditor}/>
        </Group>
    );
};

export default TextEditor;
