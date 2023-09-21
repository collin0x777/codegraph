import React, {useState} from "react";
import {Arc, Circle, Group, Line} from "react-konva";
import {CustomXButton} from "./CustomButtons.tsx";
import {Editor} from "./Canvas.tsx";

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

const SCurve: React.FC<SCurveProps> = ({ x1, y1, x2, y2 }) => {
    const maxRadius = 40
    const radius = Math.min(maxRadius, (Math.abs(y2 - y1) / 2), (Math.abs(x2 - x1) / 2));
    const strokeColor = "#86BBBD";
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

const Connection: React.FC<ConnectionProps> = ({ x1, y1, x2, y2, deleteConnection }) => {
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
                    x={(x1 + x2)/2 - 10}
                    y={(y1 + y2)/2 - 10}
                    size={20}
                    onClick={() => deleteConnection()}
                />
            ) : null}
        </Group>
    );
}

type EditorConnectionProps = {
    editor1: Editor;
    editor2: Editor;
    deleteConnection: () => void;
}

export const EditorConnection: React.FC<EditorConnectionProps> = ({ editor1, editor2, deleteConnection }) => {
    let outputType = editor1.types?.outputType;
    let inputTypes = editor2.types?.inputTypes;

    var offsetX = 0;
    var offsetY = 0;

    if (outputType && inputTypes) {
        let compatibleTypeIndex = [...inputTypes.values()].findIndex((inputType) => inputType === outputType);

        let radius = 25/2;

        offsetX = - radius * Math.sin((compatibleTypeIndex * (180 / (inputTypes.size - 1))) * (Math.PI / 180)) - 20;
        offsetY = radius * Math.cos((compatibleTypeIndex * (180 / (inputTypes.size - 1))) * (Math.PI / 180));
    }

    return (
        <Connection
        x1={editor1.x + 400}
        y1={editor1.y + 100}
        x2={editor2.x + offsetX}
        y2={editor2.y + 100 + offsetY}
        deleteConnection={deleteConnection}
        />
    );
}

export default Connection;