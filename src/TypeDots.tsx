import React from 'react';
import { Group, Text, Arc, Rect, Circle, RegularPolygon, Line } from 'react-konva';

type TypeDotsProps = {
    x: number;
    y: number;
    radius: number;
    types: string[] | null;
}

function hashCode(str: String): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }
    return hash;
}

function typeToColors(type: string | null): string[] {
    if (type === null) {
        return ["gray", "gray", "gray", "gray"];
    }

    let colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "brown",
        "black",
        "white",
        "gray",
        "cyan",
        "magenta",
        "lime",
        "olive",
        "maroon",
        "navy",
    ]

    let hash = hashCode(type);

    let color1 = colors[Math.abs(hash) % colors.length];
    let color2 = colors[Math.abs(hash * 2) % colors.length];
    let color3 = colors[Math.abs(hash * 3) % colors.length];
    let color4 = colors[Math.abs(hash * 4) % colors.length];

    return [color1, color2, color3, color4];
}

const TypeDots: React.FC<TypeDotsProps> = ({ x, y, radius, types }) => {
    let colors = types === null ? [] : types!.map(type => typeToColors(type)[0]);
    let numDots = colors.length;
    let dotRadius = radius / numDots;
    let dotSpacing = radius;

    return (
        <Group
            x={x}
            y={y}
        >
            {
                (numDots === 1) ? (
                    <Circle
                        x={0}
                        y={0}
                        radius={dotRadius}
                        fill={colors[0]}
                    />
                ) : (
                    colors.map((color, index) => {
                        return (
                            <Circle
                                key={index}
                                x={0}
                                y={0}
                                radius={dotRadius}
                                fill={color}
                                rotation={(index * (180 / (numDots - 1))) - 90}
                                offsetX={dotSpacing}
                            />
                        )
                    })
                )
            }
        </Group>
    );
}

export default TypeDots;