import React, { useState } from 'react';
import { Text, Group } from 'react-konva';
import {Html} from 'react-konva-utils';

interface EditableTextBoxProps {
    text: string;
    x: number;
    y: number;
    height: number;
    width: number;
    onChange: (text: string) => void;
}

const EditableTextBox: React.FC<EditableTextBoxProps> = ({ text, x, y, height, width, onChange }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <Group width={width + (x * 2)} height={height + (y * 2)}>
            {isEditing ? (
                <Group x={x} y={y}>
                    <Html>
                        <textarea
                            style={{
                                width: width,
                                height: height,
                            }}
                            value={text}
                            onBlur={handleBlur}
                            onChange={(e) => onChange(e.target.value)}
                            autoFocus
                        />
                    </Html>
                </Group>
            ) : (
                <Text
                    x={x}
                    y={y}
                    text={text}
                    onDblClick={handleDoubleClick}
                    height={height}
                    width={width}
                    wrap="word"
                    fontSize={12}
                    fontFamily="'Courier New', Courier, monospace"
                />
            )}
        </Group>
    );
};

export default EditableTextBox;
