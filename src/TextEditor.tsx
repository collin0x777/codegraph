import React, { useState, useRef } from 'react';
import { Group, Text, Arc, Rect, Circle, RegularPolygon, Line } from 'react-konva';
import EditableTextBox from './EditableTextBox';
import {Html} from "react-konva-utils";
import Konva from "konva";
import {CustomDropdownButton, CustomMenuButton, CustomOperatorButton, CustomPlayButton} from "./CustomButtons.tsx";

type TextEditorProps = {
    width: number;
    height: number;
};

type LogViewerProps = {
    logs: string[];
    width: number;
    height: number;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, width, height }) => {

    const containerRef = useRef<HTMLDivElement>(null);

    // todo: use this
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    return (
        <Group
            height={height}
            width={width}
        >
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="#86BBBD"
            />
            <Rect
                x={10}
                y={0}
                width={width - 20}
                height={height - 10}
                fill="#C0D4D8"
            />
            <Group
                x={15}
                y={5}
                width={width - 30}
                height={height - 20}
            >
                <Html>
                    <div
                        style={{
                            height: height - 20,
                            width: width - 30,
                            overflowY: 'scroll',
                            fontSize: 12,
                        }}
                        ref={containerRef}
                    >
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </Html>
            </Group>
        </Group>
    );
};

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

const getCurrentTimeAsString = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

const TextEditor: React.FC<TextEditorProps> = ({ width, height }) => {
    const [editableText, setEditableText] = useState<string>('Edit Me');
    const [logs, setLogs] = useState<string[]>([`[${getCurrentTimeAsString()}] Text Editor Initialized`]);
    const [operatorType, setOperatorType] = useState<number>(1);
    const [logsVisible, setLogsVisible] = useState<boolean>(false);

    const BUTTON_SIZE = 25;
    const INLET_OUTLET_OVERLAP = 5;

    const handleRunButtonClick = () => {
        setLogs([...logs, `[${getCurrentTimeAsString()}] Running: ${editableText}`]);
        setLogsVisible(true);
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
            { (operatorType <= 1) ? (
                <InletOutlet x={width - INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE}/>
            ) : null}
            { (operatorType >=1) ? (
                <InletOutlet x={-BUTTON_SIZE + INLET_OUTLET_OVERLAP} y={height/2} size={BUTTON_SIZE}/>
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
        </Group>
    );
};

export default TextEditor;
