import React, { useState } from 'react';
import {Stage, Layer, Group} from 'react-konva';
import TextEditor from './TextEditor';

type CanvasProps = {};

const Canvas: React.FC<CanvasProps> = () => {
    const [editors, setEditors] = useState<{ id: number; x: number; y: number }[]>([
        { id: 1, x: 50, y: 50 }, // Initial position of editors
    ]);

    const [connections, setConnections] = useState<{ id1: number; id2: number }[]>([]);

    const addEditor = () => {
        const newEditorId = editors.length + 1;
        setEditors([...editors, { id: newEditorId, x: 50, y: 50 }]);
    };

    const removeEditor = (editorId: number) => {
        const updatedEditors = editors.filter((editor) => editor.id !== editorId);
        setEditors(updatedEditors);
    };

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <button onClick={addEditor}>Add Editor</button>
            <Stage width={window.innerWidth} height={window.innerHeight} draggable>
                <Layer>
                    {editors.map((editor) => (
                        <Group
                            key={editor.id}
                            x={editor.x}
                            y={editor.y}
                            draggable
                            onDragEnd={(e) => {
                                const updatedEditors = editors.map((ed) =>
                                    ed.id === editor.id ? { ...ed, x: e.target.x(), y: e.target.y() } : ed
                                );
                                setEditors(updatedEditors);
                            }}
                        >
                            <TextEditor
                                height={200}
                                width={400}
                            />
                        </Group>
                    ))}
                    {connections.map((connection) => (
                        <Group
                            key={`${connection.id1}-${connection.id2}`}
                        >

                        </Group>
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default Canvas;
