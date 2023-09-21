import React, {useState, useRef, useEffect, createRef} from 'react';
import {Stage, Layer, Group, Circle, Rect, Line, Text} from 'react-konva';
import TextEditor from './TextEditor';
import Konva from "konva";
import {CustomAnimatedPlusButton, CustomPlusButton} from "./CustomButtons.tsx";
import Connection, {EditorConnection} from "./Connection.tsx";
import {FunctionTypes} from "./Requests.tsx";

type CanvasProps = {};

export type Editor = {
    id: number;
    x: number;
    y: number;
    inletRef: React.MutableRefObject<any>;
    types: FunctionTypes | null;
}

const Canvas: React.FC<CanvasProps> = () => {
    const [scale, setScale] = useState<number>(1);
    const stageRef = useRef<any>(null);
    const zoomLayerRef = useRef<any>(null);

    const [editors, setEditors] = useState<Editor[]>([
        { id: 1, x: 50, y: 50, inletRef: useRef<any>(null), types: null },
    ]);

    const [connections, setConnections] = useState<{ id1: number; id2: number }[]>([]);

    const addNewEditor = () => {
        const newEditorId = editors.reduce((maxId, editor) => Math.max(editor.id, maxId), -1) + 1;
        const ref = createRef<any>()

        setEditors([...editors, { id: newEditorId, x: 50, y: 50, inletRef: ref, types: null }]);
    };

    const removeEditor = (editorId: number) => {
        const updatedEditors = editors.filter((editor) => editor.id !== editorId);
        const updatedConnections = connections.filter((connection) => connection.id1 !== editorId && connection.id2 !== editorId);

        setEditors(updatedEditors);
        setConnections(updatedConnections);
    };

    const updateEditorTypes = (editorId: number, types: FunctionTypes | null) => {
        setEditors((editors) => {
            return editors.map((editor) => {
                if (editor.id === editorId) {
                    return { ...editor, types: types };
                } else {
                    return editor;
                }
            })
        })
    }

    const removeConnection = (id1: number, id2: number) => {
        setConnections((connections) => {
            return connections.filter((connection) =>
                !(connection.id1 == id1 && connection.id2 == id2)
            );
        });
    }

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

    const attemptConnection = (editor: Editor, x: number, y: number) => {
        let connectedEditor = editors.find((targetEditor) => {
            let notCurrentEditor = targetEditor.id != editor.id;
            // if either has no types, then we allow it, but if both have types, then we check if they are compatible

            let validTypes = !editor.types || !targetEditor.types || (editor.types.outputType !== null && [...targetEditor.types.inputTypes.values()].includes(editor.types.outputType))
            // if (validTypes) {
            //     console.log("Valid types");
            //     console.log(`Input types ${[...targetEditor.types!.inputTypes.values()]}`)
            //     console.log(`Output type ${editor.types!.outputType}`)
            // }

            return notCurrentEditor &&
                validTypes &&
                targetEditor.inletRef.current.intersects({ x, y })
        })

        if (connectedEditor) {
            console.log("Found connection between ", editor.id, " and ", connectedEditor.id);
            let connection = { id1: editor.id, id2: connectedEditor.id };
            if (connections.some((conn) => conn.id1 == connection.id1 && conn.id2 == connection.id2)) {
                console.log("Connection already exists")
            } else {
                setConnections([...connections, {id1: editor.id, id2: connectedEditor.id}]);
            }
        } else {
            console.log("No connection found")
        }
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onWheel={handleWheel} ref={stageRef}>
            {/*<ScaledDotLayer width={window.innerWidth} height={window.innerHeight} scale={scale} />*/}
            <Layer ref={zoomLayerRef} scale={{ x: scale, y: scale }}>
                {connections.map((connection) => (
                    <Group
                        key={`${connection.id1}-${connection.id2}`}
                    >
                        <EditorConnection
                            editor1={editors.find((editor) => editor.id == connection.id1)!}
                            editor2={editors.find((editor) => editor.id == connection.id2)!}
                            deleteConnection={() => { removeConnection(connection.id1, connection.id2) }}
                        />
                        {/*<Connection*/}
                        {/*    x1={editors.find((editor) => editor.id == connection.id1)!.x + 400}*/}
                        {/*    y1={editors.find((editor) => editor.id == connection.id1)!.y + 100}*/}
                        {/*    x2={editors.find((editor) => editor.id == connection.id2)!.x}*/}
                        {/*    y2={editors.find((editor) => editor.id == connection.id2)!.y + 100}*/}
                        {/*    deleteConnection={() => { removeConnection(connection.id1, connection.id2) }}*/}
                        {/*/>*/}
                    </Group>
                ))}
                {
                    editors.map((editor) => (
                    <Group
                        key={`editor-${editor.id}`}
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
                        {/*<Text*/}
                        {/*    x={0}*/}
                        {/*    y={-20}*/}
                        {/*    text={`Inputs: ${editor.types && [...editor.types!.inputTypes.values()]}`} />*/}
                        {/*<Text*/}
                        {/*    x={200}*/}
                        {/*    y={-20}*/}
                        {/*    text={`Output: ${editor.types && editor.types.outputType}`} />*/}
                        <TextEditor
                            height={200}
                            width={400}
                            attemptConnection={(x, y) => { attemptConnection(editor, x, y) }}
                            inletRef={editor.inletRef}
                            deleteEditor={() => {removeEditor(editor.id) }}
                            updateTypes={(types: FunctionTypes | null) => { updateEditorTypes(editor.id, types) }}
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
