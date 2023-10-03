import React, {useRef, useState} from 'react';
import {Group, Layer, Stage, Text} from 'react-konva';
import TextEditor, {defaultEditorState, EditorState} from './TextEditor';
import Konva from "konva";
import {CustomAnimatedPlayButton, CustomAnimatedPlusButton} from "./CustomButtons.tsx";
import {EditorConnection} from "./Connection.tsx";
import {getArcOffset} from "./TypeDots.tsx";
import ExecutionPane from "./ExecutionPane.tsx";

type Connection = {
    id1: number;
    id2: number;
    paramId: number;
}

type CanvasProps = {};

const Canvas: React.FC<CanvasProps> = () => {
    const [scale, setScale] = useState<number>(1);
    const stageRef = useRef<any>(null);
    const zoomLayerRef = useRef<any>(null);

    const [editors, setEditors] = useState<EditorState[]>([
        defaultEditorState(0, 50, 50),
    ]);

    const [connections, setConnections] = useState<Connection[]>([]);

    const addEditor = () => {
        const newEditorId = editors.reduce((maxId, editor) => Math.max(editor.id, maxId), -1) + 1;

        setEditors([...editors, defaultEditorState(newEditorId, 50, 50)]);
    };

    const removeEditor = (editorId: number) => {
        const updatedEditors = editors.filter((editor) => editor.id !== editorId);
        const updatedConnections = connections.filter((connection) => connection.id1 !== editorId && connection.id2 !== editorId);

        setEditors(updatedEditors);
        setConnections(updatedConnections);
    };

    const updateEditor = (editorId: number, transform: (editor: EditorState) => EditorState) => {
        setEditors((editors) => {
            return editors.map((editor) => {
                if (editor.id === editorId) {
                    return transform(editor);
                } else {
                    return editor;
                }
            })
        })
    }

    const removeConnection = (connectionToRemove: Connection) => {
        setConnections((connections) => {
            return connections.filter((connection) => connection !== connectionToRemove);
        });
    }

    const minScale = 0.5;
    const maxScale = 3;

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

    const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    }

    const withinDistance = (x1: number, y1: number, x2: number, y2: number, distance: number): boolean => {
        return getDistance(x1, y1, x2, y2) < distance
    }

    const attemptConnection = (editor: EditorState, x: number, y: number) => {
        let potentialEditors = editors.filter((targetEditor) => {
            let notCurrentEditor = targetEditor.id !== editor.id;
            let inRange = withinDistance(x, y, targetEditor.x, targetEditor.y + targetEditor.height / 2, 50)

            return notCurrentEditor && inRange
        })

        console.log(`Potential editors: ${potentialEditors.map((editor) => {return editor.id})}`)

        let potentialConnections = potentialEditors.flatMap((targetEditor) => {
            let inputs = targetEditor.types?.inputTypes

            if (inputs) {
                let numTypes = inputs.length
                return inputs
                    .filter((input, index) => {
                        return input.type === editor.types?.outputType &&
                            !connections.includes({id1: editor.id, id2: targetEditor.id, paramId: index})
                    })
                    .map((input, index) => {
                        let offset = getArcOffset(25, index, numTypes)

                        return {
                            id1: editor.id,
                            id2: targetEditor.id,
                            paramId: index,
                            x: targetEditor.x - (offset.offsetX),
                            y: targetEditor.y + targetEditor.height / 2 - offset.offsetY
                        }
                    })
            } else {
                return []
            }
        })

        console.log(`Potential connections: ${potentialConnections.map((connection) => {
            return `Id: ${connection.id2}, Param: ${connection.paramId}`
        })}`)

        if (potentialConnections.length > 0) {
            let closestConnection = potentialConnections.reduce((connection1, connection2) => {
                return getDistance(x, y, connection1.x, connection1.y) < getDistance(x, y, connection2.x, connection2.y) ?
                    connection1 : connection2
            })

            if (withinDistance(x, y, closestConnection.x, closestConnection.y, 15)) {
                setConnections([...connections, closestConnection]);
            }
        }
    }

    const validateGraph = () => {
        console.log("Validating graph")

        let missingInputs = editors.flatMap( (editor) => {
            let expectedInputs = editor.types?.inputTypes.length
            let receivedInputs = connections.filter((connection) => {return connection.id2 === editor.id}).length

            if (!expectedInputs || expectedInputs === receivedInputs) {
                return []
            } else {
                return [`Editor ${editor.id} is missing ${expectedInputs - receivedInputs} inputs`]
            }
        })

        if (missingInputs.length === 0) {
            return true
        } else {
            console.log("Some nodes are missing inputs")
            missingInputs.forEach(console.log)
            return false
        }
    }

    const buildGraph = () => {
        console.log("Building graph")

        return editors.map((editor) => {
            let edges = connections.filter((connection) => connection.id1 === editor.id).map((connection) => {
                return {
                    id: connection.id2,
                    paramId: connection.paramId
                }
            })

            return {
                id: editor.id,
                code: editor.code,
                connections: edges
            }
        })
    }

    const executeGraph = () => {
        if (validateGraph()) {
            let graph = buildGraph()
            console.log(graph)

            console.log("Executing graph")
        } else {
            console.log("Graph will not be executed as it failed to build")
        }
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onWheel={handleWheel} ref={stageRef}>
            {/*<ScaledDotLayer width={window.innerWidth} height={window.innerHeight} scale={scale} />*/}
            <Layer ref={zoomLayerRef} scale={{x: scale, y: scale}}>
                {
                    editors.map((editor) => (
                        <Group
                            key={`editor-${editor.id}`}
                            ref={editor.ref}
                            x={editor.x}
                            y={editor.y}
                            draggable
                            onDragMove={(e) => {
                                const updatedEditors = editors.map((ed) =>
                                    ed.id === editor.id ? {...ed, x: e.target.x(), y: e.target.y()} : ed
                                );
                                editor.ref.current.moveToTop();
                                setEditors(updatedEditors);
                            }}
                            onClick={(e) => {
                                editor.ref.current.moveToTop();
                            }}
                        >
                            <Text
                                x={0}
                                y={-20}
                                text={`Inputs: ${editor.types && [...editor.types!.inputTypes.map((input) => input.type)].join(", ")}`}/>
                            <Text
                                x={300}
                                y={-20}
                                text={`Output: ${editor.types && editor.types.outputType}`}/>
                            <TextEditor
                                editor={editor}
                                deleteEditor={() => {
                                    removeEditor(editor.id)
                                }}
                                updateEditor={(transform: (editor: EditorState) => EditorState) => {
                                    updateEditor(editor.id, transform)
                                }}
                                attemptConnection={(x, y) => {
                                    attemptConnection(editor, x, y)
                                }}
                            />
                        </Group>
                    ))}
                {connections.map((connection) => (
                    <Group
                        key={`${connection.id1}-${connection.id2}-${connection.paramId}`}
                    >
                        <EditorConnection
                            editor1={editors.find((editor) => editor.id === connection.id1)!}
                            editor2={editors.find((editor) => editor.id === connection.id2)!}
                            paramIndex={connection.paramId}
                            deleteConnection={() => {
                                removeConnection(connection)
                            }}
                        />
                    </Group>
                ))}
            </Layer>
            <Layer>
                <ExecutionPane
                    x={0}
                    y={window.innerHeight}
                    width={window.innerWidth}
                    initialHeight={200}
                    maxHeight={600}
                    minHeight={100}
                    addEditor={addEditor}
                />
            </Layer>
        </Stage>
    );
};

export default Canvas;
