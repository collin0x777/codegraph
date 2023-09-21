import React, { useState, useRef } from 'react';
import { Group, Text, Arc, Rect, Circle, RegularPolygon, Line } from 'react-konva';
import EditableTextBox from './EditableTextBox';
import {
    CustomAnimatedTableButton,
    CustomCodeButton,
    CustomDropdownButton,
    CustomMenuButton,
    CustomOperatorButton,
    CustomPlayButton, CustomTableButton, CustomXButton
} from "./CustomButtons.tsx";
import {DraggableOutlet, WatchfulInlet} from "./InletOutlet.tsx";
import LogViewer from "./LogViewer.tsx";
import Konva from "konva";
import {FunctionTypes, getFunction, getTypes} from "./Requests.tsx";
import TestViewer, {Tests} from "./TestViewer.tsx";
import CodeViewer from "./CodeViewer.tsx";

type TextEditorProps = {
    width: number;
    height: number;
    attemptConnection: (x: number, y: number) => void;
    inletRef: React.MutableRefObject<any>;
    deleteEditor: () => void;
    updateTypes: (types: FunctionTypes | null) => void;
};

const getCurrentTimeAsString = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

const TextEditor: React.FC<TextEditorProps> = ({ width, height, attemptConnection, inletRef, deleteEditor, updateTypes }) => {
    const [editableText, setEditableText] = useState<string>('Edit Me');
    const [logs, setLogs] = useState<string[]>([`[${getCurrentTimeAsString()}] Text Editor Initialized`]);
    const [tests, setTests] = useState<Tests>({ testCases: [], inputFieldNames: [] });
    const [testResults, setTestResults] = useState<(string | null)[]>([]);
    const [operatorType, setOperatorType] = useState<number>(1);
    // 0 = no panel, 1 = log panel, 2 = test panel, 3 = code panel
    const [bottomPanel, setBottomPanel] = useState<number>(0);
    const [types, setTypes] = useState<(FunctionTypes | null)>(null); // [inputTypes, outputType
    const [generatedCode, setGeneratedCode] = useState<(string | null)>(null);

    const BUTTON_SIZE = 25;
    const INLET_OUTLET_OVERLAP = 5;

    function log(str: string) {
        setLogs((logs) => [...logs, `[${getCurrentTimeAsString()}] ${str}`]);
    }

    const handleRunButtonClick = () => {
        log('Building function...');
        setBottomPanel(1);
        getTypes(editableText).then((types) => {
            setTypes(types)
            updateTypes(types);

            log('Got types!');
            var inputs: string[] = []
            for (let [paramName, paramType] of types!.inputTypes.entries()) {
                inputs.push(`${paramName}: ${paramType}`)
            }

            log(`Input type(s): (${inputs.join(', ')})`)
            log(`Output types: ${types!.outputType}`);

            getFunction(editableText, types!).then((generatedFunction) => {
                log('Generated function!');
                setGeneratedCode(generatedFunction);
            });
        });
    };

    const handleDropdownButtonClick = () => {
        setBottomPanel((bottomPanel == 1) ? 0 : 1);
    };

    const handleMenuButtonClick = () => {
        // Handle menu button click
        setTests({
            testCases: [
                {
                    inputs: ["1", "2", "3"],
                    output: "6"
                },
                {
                    inputs: ["4", "5", "6"],
                    output: "15"
                },
                {
                    inputs: ["7", "8", "9"],
                    output: "24"
                }
            ],
            inputFieldNames: ["a", "b", "c"]
        });

        setTestResults(["6", null, "25"]);
    };

    const handleOperatorButtonClick = () => {
        setOperatorType((operatorType + 1) % 3);
    };

    const handleCodeButtonClick = () => {
        setBottomPanel((bottomPanel == 3) ? 0 : 3);
    }

    const handleTableButtonClick = () => {
        setBottomPanel((bottomPanel == 2) ? 0 : 2);
    }

    const [draggingConnection, setDraggingConnection] = useState(false);
    // const [connectionStartPos, setConnectionStartPos] = useState({ x: 0, y: 0 });
    const [connectionEndPos, setConnectionEndPos] = useState({ x: 0, y: 0 });

    const handleInletDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        setDraggingConnection(true);
        const inletPos = e.target.getAbsolutePosition();
        // setConnectionStartPos({ x: inletPos.x, y: inletPos.y });
    };

    const handleInletDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (draggingConnection) {
            const inletPos = e.target.getAbsolutePosition();
            setConnectionEndPos({ x: inletPos.x, y: inletPos.y });
            // Handle the connection logic here, e.g., store the connection information.
            setDraggingConnection(false);
        }
    };

    return (
        <Group width={width} height={height}>
            <Rect
                x={5}
                y={5}
                width={width - 10}
                height={height - 10}
                fill="#76949F"
                stroke="#86BBBD"
                strokeWidth={10}
            />
            <EditableTextBox
                text={editableText}
                x={20}
                y={20}
                width={width - 40}
                height={height - 80}
                onChange={(text) => setEditableText(text)}
            />
            { (operatorType >=1) ? (
                <WatchfulInlet x={-BUTTON_SIZE + INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE} inletRef={inletRef} types={types}/>
            ) : null}
            { (operatorType <= 1) ? (
                <DraggableOutlet x={width - INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE} attemptConnection={attemptConnection} types={types}/>
            ) : null}

            { (bottomPanel === 1) ? (
                <Group y={height}>
                    <LogViewer logs={logs} width={width} height={100}/>
                </Group>
            ) : null}

            { (bottomPanel === 2) ? (
                <Group y={height}>
                    <TestViewer tests={tests} results={testResults} width={width} height={100}/>
                </Group>
            ) : null}

            { (bottomPanel === 3) ? (
                <Group y={height}>
                    <CodeViewer code={generatedCode} width={width} height={100}/>
                </Group>
            ) : null}

            <CustomPlayButton x={15} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleRunButtonClick}/>
            <CustomDropdownButton x={65} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleDropdownButtonClick}/>
            <CustomMenuButton x={115} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleMenuButtonClick}/>
            <CustomOperatorButton x={165} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleOperatorButtonClick}/>
            <CustomCodeButton x={215} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleCodeButtonClick}/>
            <CustomAnimatedTableButton x={265} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleTableButtonClick} status={0}/>
            <CustomXButton x={width - (15+BUTTON_SIZE)} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={deleteEditor}/>
        </Group>
    );
};

export default TextEditor;
