import React, {useState} from "react";
import {Arc, Group, Line} from "react-konva";
import {FunctionTypes} from "./Requests.tsx";
import Konva from "konva";
import {TypeDots, TypeDotsArc} from "./TypeDots.tsx";
import Connection from "./Connection.tsx";

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
    types: FunctionTypes | null;
}

export const DraggableOutlet: React.FC<DraggableOutletProps> = ({ x, y, size, attemptConnection, types }) => {

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
            <Connection x1={0} y1={0} x2={connectionEndPos.x} y2={connectionEndPos.y} deleteConnection={() => {}}/>
            {/*<Line points={[0, 0, connectionEndPos.x, connectionEndPos.y]} stroke="#86BBBD" strokeWidth={2}/>*/}
            <Group
                x={connectionEndPos.x}
                y={connectionEndPos.y}
                draggable
                onDragStart={handleOutletDragStart}
                onDragMove={handleOutletDragMove}
                onDragEnd={handleOutletDragEnd}
            >
                <TypeDotsArc x={0} y={0} radius={size/2} params={types ? [{name: "output", type: types!.outputType!}] : null}/>
            </Group>
        </Group>
    )
}

type WatchfulInletProps = {
    x: number;
    y: number;
    size: number;
    inletRef:  React.MutableRefObject<Konva.Arc>;
    types: (FunctionTypes | null);
}

export const WatchfulInlet: React.FC<WatchfulInletProps> = ({ x, y, size, inletRef, types }) => {
    return (
        <Group x={x} y={y}>
            <Arc
                x={0}
                y={0}
                innerRadius={0} // Set the inner radius to 0 for a full semicircle
                outerRadius={size} // Adjust the outer radius as needed
                angle={180} // Set the angle to 180 degrees for a semicircle
                fill="#86BBBD" // Fill color
                rotation={-90}
                ref={inletRef}
            />
            {
                types ? (
                    <TypeDots x={0} y={0} radius={size/2} params={types.inputTypes}/>
                ) : null
            }
        </Group>
    )
}