import React, {useState, useRef, useEffect, createRef} from 'react';
import {Stage, Layer, Group, Circle, Rect, Line} from 'react-konva';
import TextEditor from './TextEditor';
import Konva from "konva";
import {CustomAnimatedPlusButton, CustomPlusButton} from "./CustomButtons.tsx";

type ScaledDotLayerProps = {
    width: number;
    height: number;
    scale: number;
}

const ScaledDotLayer: React.FC<ScaledDotLayerProps> = ({ width, height, scale }) => {
    const DOT_RADIUS = 5 * scale;
    const DOT_SPACING = 50 * scale;

    // Calculate the number of dots in both dimensions
    const numDotsX = Math.ceil(width / DOT_SPACING);
    const numDotsY = Math.ceil(height / DOT_SPACING);

    // Create an array to store the dots
    const dots = [];

    for (let i = 0; i < numDotsX; i++) {
        for (let j = 0; j < numDotsY; j++) {
            // Calculate the position of each dot
            const x = i * DOT_SPACING;
            const y = j * DOT_SPACING;

            // Calculate the radius of each dot
            const radius = (i % 5 === 0 && j % 5 === 0) ? DOT_RADIUS * 2 : DOT_RADIUS;

            // Push the dot to the array
            dots.push(
                <Circle
                    key={`${i}-${j}`}
                    x={x}
                    y={y}
                    radius={radius}
                    fill="black"
                />
            );
        }
    }

    return (
        <Layer>
            {dots}
        </Layer>
    );
}

type CanvasProps = {};

type Editor = {
    id: number;
    x: number;
    y: number;
    inletRef: React.MutableRefObject<any>;
    inputType: string | null;
    outputType: string | null;
}

const Canvas: React.FC<CanvasProps> = () => {
    const [scale, setScale] = useState<number>(1);
    const stageRef = useRef<any>(null);
    const zoomLayerRef = useRef<any>(null);

    const [editors, setEditors] = useState<Editor[]>([
        { id: 1, x: 50, y: 50, inletRef: useRef<any>(null), inputType: null, outputType: null },
    ]);

    const [connections, setConnections] = useState<{ id1: number; id2: number }[]>([]);

    const addNewEditor = () => {
        const newEditorId = editors.length + 1;
        const ref = createRef<any>()

        setEditors([...editors, { id: newEditorId, x: 50, y: 50, inletRef: ref, inputType: null, outputType: null }]);
    };

    const removeEditor = (editorId: number) => {
        const updatedEditors = editors.filter((editor) => editor.id !== editorId);
        setEditors(updatedEditors);
    };

    const minScale = 0.5;
    const maxScale = 3;
    const ADD_BUTTON_SIZE = 60;
    const ADD_BUTTON_OFFSET = 45;

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault(); // Prevent the default scroll behavior

        // Calculate the new scale based on the scroll direction
        const newScale = e.evt.deltaY > 0 ? scale * 1.1 : scale / 1.1;

        // Limit the scale to a reasonable range (adjust as needed)
        const clampedScale = Math.min(maxScale, Math.max(minScale, newScale));

        // Update the scale and set the new position to keep the center of the stage in view
        setScale(clampedScale);

        // Calculate the new position to keep the center of the stage in view
        const stage = stageRef.current;
        const layer = zoomLayerRef.current;
        const pointerPosition = stage.getPointerPosition();
        const offset = {
            x: (pointerPosition.x - stage.width() / 2) * (clampedScale - scale),
            y: (pointerPosition.y - stage.height() / 2) * (clampedScale - scale),
        };

        // Update the position
        layer.x(layer.x() - offset.x);
        layer.y(layer.y() - offset.y);

        layer.batchDraw();
    };

    const attemptConnection = (id: number, x: number, y: number) => {
        let connectedEditor = editors.find((editor) => {
            return editor.id != id && editor.inletRef.current.intersects({ x, y })
        })

        if (connectedEditor) {
            console.log("Found connection between ", id, " and ", connectedEditor.id);
            let connection = { id1: id, id2: connectedEditor.id };
            if (connections.some((conn) => conn.id1 == connection.id1 && conn.id2 == connection.id2)) {
                console.log("Connection already exists")
            } else {
                setConnections([...connections, {id1: id, id2: connectedEditor.id}]);
            }
        } else {
            console.log("No connection found")
        }
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onWheel={handleWheel} ref={stageRef}>
            {/*<ScaledDotLayer width={window.innerWidth} height={window.innerHeight} scale={scale} />*/}
            <Layer ref={zoomLayerRef} scale={{ x: scale, y: scale }}>
                {
                    editors.map((editor) => (
                    <Group
                        key={editor.id}
                        x={editor.x}
                        y={editor.y}
                        draggable
                        onDragMove={(e) => {
                            const updatedEditors = editors.map((ed) =>
                                ed.id === editor.id ? { ...ed, x: e.target.x(), y: e.target.y() } : ed
                            );
                            setEditors(updatedEditors);
                        }}
                    >
                        <TextEditor
                            height={200}
                            width={400}
                            attemptConnection={(x, y) => { attemptConnection(editor.id, x, y) }}
                            inletRef={editor.inletRef}
                        />
                    </Group>
                ))}
                {connections.map((connection) => (
                    <Group
                        key={`${connection.id1}-${connection.id2}`}
                    >
                        <Line
                            points={[
                                editors.find((editor) => editor.id == connection.id1)!.x + 400,
                                editors.find((editor) => editor.id == connection.id1)!.y + 100,
                                editors.find((editor) => editor.id == connection.id2)!.x,
                                editors.find((editor) => editor.id == connection.id2)!.y + 100
                            ]}
                            stroke="#86BBBD"
                            strokeWidth={4}
                        />
                    </Group>
                ))}
            </Layer>
            <Layer>
                <CustomAnimatedPlusButton x={ADD_BUTTON_OFFSET} y={window.innerHeight - ADD_BUTTON_SIZE - ADD_BUTTON_OFFSET} size={ADD_BUTTON_SIZE} onClick={addNewEditor}/>
            </Layer>
        </Stage>
    );
};

export default Canvas;
