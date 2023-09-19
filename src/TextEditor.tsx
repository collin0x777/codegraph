import React, { useState, useRef } from 'react';
import { Group, Text, Arc, Rect, Circle, RegularPolygon, Line } from 'react-konva';
import EditableTextBox from './EditableTextBox';
import {CustomDropdownButton, CustomMenuButton, CustomOperatorButton, CustomPlayButton} from "./CustomButtons.tsx";
import LogViewer from "./LogViewer.tsx";
import Konva from "konva";
import TypeDial from "./TypeDial.tsx";
import {getFunction, getTypes} from "./Requests.tsx";

type TextEditorProps = {
    width: number;
    height: number;
    attemptConnection: (x: number, y: number) => void;
    inletRef: React.MutableRefObject<any>;
};

type ConnectionProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const Connection: React.FC<ConnectionProps> = ({ x1, y1, x2, y2 }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Group>
            <Line
                points={[x1, y1, x2, y2]}
                stroke="#86BBBD"
                strokeWidth={2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {isHovered ? (
                <Circle
                    x={x1}
                    y={y1}
                    radius={5}
                    fill="#86BBBD"
                />
            ) : null}
        </Group>
    );
}

type InletOutletProps = {
    x: number;
    y: number;
    size: number;
}

const InletOutlet: React.FC<InletOutletProps> = ({ x, y, size }) => {
    return (
        <Arc
            x={x}
            y={y}
            innerRadius={0} // Set the inner radius to 0 for a full semicircle
            outerRadius={size} // Adjust the outer radius as needed
            angle={180} // Set the angle to 180 degrees for a semicircle
            fill="#86BBBD" // Fill color
            rotation={-90}
        />
    );
}

type DraggableOutletProps = {
    x: number;
    y: number;
    size: number;
    attemptConnection: (x: number, y: number) => void;
    type: string | null;
}

const DraggableOutlet: React.FC<DraggableOutletProps> = ({ x, y, size, attemptConnection, type }) => {

    const [draggingConnection, setDraggingConnection] = useState(false);
    const [connectionEndPos, setConnectionEndPos] = useState({ x: 0, y: 0 });

    const handleOutletDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;

        if (!draggingConnection) {
            setDraggingConnection(true);
        }
    };

    const handleOutletDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;

        if (draggingConnection) {
            const outletPos = e.target.position();
            setConnectionEndPos({ x: outletPos.x, y: outletPos.y });
        }
    };

    const handleOutletDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;

        if (draggingConnection) {
            attemptConnection(e.target.getAbsolutePosition().x, e.target.getAbsolutePosition().y);

            setConnectionEndPos({ x: 0, y: 0 });

            setDraggingConnection(false);
        }
    };

    return (
        <Group x={x} y={y} >
            <InletOutlet x={0} y={0} size={size}/>
            <Line points={[0, 0, connectionEndPos.x, connectionEndPos.y]} stroke="#86BBBD" strokeWidth={2}/>
            <Group
                x={connectionEndPos.x}
                y={connectionEndPos.y}
                draggable
                onDragStart={handleOutletDragStart}
                onDragMove={handleOutletDragMove}
                onDragEnd={handleOutletDragEnd}
            >
                <TypeDial x={0} y={0} radius={size/2} type={type}/>
            </Group>
        </Group>
    )
}

type WatchfulInletProps = {
    x: number;
    y: number;
    size: number;
    inletRef:  React.MutableRefObject<Konva.Arc>;
}

const WatchfulInlet: React.FC<WatchfulInletProps> = ({ x, y, size, inletRef }) => {
    return (
        <Arc
            x={x}
            y={y}
            innerRadius={0} // Set the inner radius to 0 for a full semicircle
            outerRadius={size} // Adjust the outer radius as needed
            angle={180} // Set the angle to 180 degrees for a semicircle
            fill="#86BBBD" // Fill color
            rotation={-90}
            ref={inletRef}
        />
    )
}

const getCurrentTimeAsString = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

const TextEditor: React.FC<TextEditorProps> = ({ width, height, attemptConnection, inletRef }) => {
    const [editableText, setEditableText] = useState<string>('Edit Me');
    const [logs, setLogs] = useState<string[]>([`[${getCurrentTimeAsString()}] Text Editor Initialized`]);
    const [operatorType, setOperatorType] = useState<number>(1);
    const [logsVisible, setLogsVisible] = useState<boolean>(false);
    const [inputType, setInputType] = useState<string | null>(null);
    const [outputType, setOutputType] = useState<string | null>(null);

    const BUTTON_SIZE = 25;
    const INLET_OUTLET_OVERLAP = 5;

    function log(str: string) {
        setLogs([...logs, `[${getCurrentTimeAsString()}] ${str}`]);
    }

    const handleRunButtonClick = () => {
        log('Building function...');
        setLogsVisible(true);
        getTypes(editableText).then((types) => {
            log('Got types!');
            log(`Input type(s): ${types![0]}`);
            log(`Output types: ${types![1]}`);

            setInputType(types![0]);
            setOutputType(types![1]);

            getFunction(editableText, types!).then((generatedFunction) => {
                log('Got function!');
                log(`Function: ${generatedFunction}`);
            });
        });
    };

    const handleDropdownButtonClick = () => {
        setLogsVisible(!logsVisible);
    };

    const handleMenuButtonClick = () => {
        // Handle menu button click
    };

    const handleOperatorButtonClick = () => {
        setOperatorType((operatorType + 1) % 3);
    };

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
                <>
                    <WatchfulInlet x={-BUTTON_SIZE + INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE} inletRef={inletRef}/>
                    <TypeDial x={-BUTTON_SIZE + INLET_OUTLET_OVERLAP} y={height/2} radius={BUTTON_SIZE/2} type={null}/>
                </>
            ) : null}
            { (operatorType <= 1) ? (
                <>
                    <DraggableOutlet x={width - INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE} attemptConnection={attemptConnection} type={null}/>
                </>
            ) : null}

            { logsVisible ? (
                <Group y={height}>
                    <LogViewer logs={logs} width={width} height={100}/>
                </Group>
            ) : null}

            <CustomPlayButton x={15} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleRunButtonClick}/>
            <CustomDropdownButton x={60} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleDropdownButtonClick}/>
            <CustomMenuButton x={110} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleMenuButtonClick}/>
            <CustomOperatorButton x={160} y={height - (15+BUTTON_SIZE)} size={BUTTON_SIZE} onClick={handleOperatorButtonClick}/>
            {/*<Connection x1={200} y1={400} x2={600} y2={500}/>*/}
        </Group>
    );
};

export default TextEditor;
