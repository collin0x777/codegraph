import React, {useState} from "react";
import {Arc, Circle, Group, Line} from "react-konva";
import {CustomXButton} from "./CustomButtons.tsx";
import {EditorState} from "./TextEditor.tsx";
import {getArcOffset} from "./TypeDots.tsx";

type ConnectionProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    deleteConnection: () => void;
}

type SCurveProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const SCurve: React.FC<SCurveProps> = ({x1, y1, x2, y2}) => {
    const maxRadius = 40
    const radius = Math.min(maxRadius, (Math.abs(y2 - y1) / 2), (Math.abs(x2 - x1) / 2));
    // const strokeColor = "#86BBBD";
    const strokeColor = "black";
    const strokeWidth = 3;

    (y1 > y2) && ([y1, y2] = [y2, y1]) && ([x1, x2] = [x2, x1]);

    let rotationOffset = (x1 < x2) ? 0 : 90;
    let signedRadius = (x1 < x2) ? radius : -radius;

    let dx = x2 - x1;
    let dy = y2 - y1;

    let dxSegment = dx > 0 ? (dx / 2) - radius : (dx / 2) + radius;
    let dySegment = dy - (radius * 2);

    let arc1CenterX = x1 + dxSegment;
    let arc1CenterY = y1 + radius;

    let arc2CenterX = x2 - dxSegment;
    let arc2CenterY = y2 - radius;

    return (
        <Group>
            <Line
                points={[x1, y1, (x1 + dxSegment), y1]}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
            <Arc
                x={arc1CenterX}
                y={arc1CenterY}
                innerRadius={radius}
                outerRadius={radius}
                angle={90}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                rotation={-90 - rotationOffset}
            />
            <Line
                points={[(x1 + dxSegment + signedRadius), (y1 + radius), (x1 + dxSegment + signedRadius), (y1 + radius + dySegment)]}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
            <Arc
                x={arc2CenterX}
                y={arc2CenterY}
                innerRadius={radius}
                outerRadius={radius}
                angle={90}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                rotation={90 - rotationOffset}
            />
            <Line
                points={[x2 - dxSegment, y2, x2, y2]}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        </Group>
    )
}

const Connection: React.FC<ConnectionProps> = ({x1, y1, x2, y2, deleteConnection}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Group
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <SCurve x1={x1} y1={y1} x2={x2} y2={y2}/>
            {isHovered ? (
                <CustomXButton
                    x={(x1 + x2) / 2 - 10}
                    y={(y1 + y2) / 2 - 10}
                    size={20}
                    onClick={() => deleteConnection()}
                />
            ) : null}
        </Group>
    );
}

type EditorConnectionProps = {
    editor1: EditorState;
    editor2: EditorState;
    paramIndex: number;
    deleteConnection: () => void;
}

export const EditorConnection: React.FC<EditorConnectionProps> = ({editor1, editor2, paramIndex, deleteConnection}) => {
    let outputType = editor1.types?.outputType;
    let inputTypes = editor2.types?.inputTypes;

    let offsetX = 0;
    let offsetY = 0;

    if (inputTypes) {
        let offsets = getArcOffset(25, paramIndex, inputTypes.length)
        offsetX = offsets.offsetX;
        offsetY = offsets.offsetY;
    }

    return (
        <Connection
            x1={editor1.x + editor1.width}
            y1={editor1.y + editor1.height / 2}
            x2={editor2.x - offsetX}
            y2={editor2.y + editor2.height / 2 - offsetY}
            deleteConnection={deleteConnection}
        />
    );
}

export default Connection;