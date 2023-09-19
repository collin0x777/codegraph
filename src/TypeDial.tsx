

import React from 'react';
import { Group, Text, Arc, Rect, Circle, RegularPolygon, Line } from 'react-konva';
import {hash} from "bun";

type TypeDialProps = {
    x: number;
    y: number;
    radius: number;
    type: string | null;
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

const TypeDial: React.FC<TypeDialProps> = ({ x, y, radius, type }) => {
    let colors = typeToColors(type);

    return (
        <Group
            x={x}
            y={y}
        >
            <Arc
                angle={90}
                rotation={0}
                innerRadius={0}
                outerRadius={radius}
                fill={colors[0]}
            />
            <Arc
                angle={90}
                rotation={90}
                innerRadius={0}
                outerRadius={radius}
                fill={colors[1]}
            />
            <Arc
                angle={90}
                rotation={180}
                innerRadius={0}
                outerRadius={radius}
                fill={colors[2]}
            />
            <Arc
                angle={90}
                rotation={270}
                innerRadius={0}
                outerRadius={radius}
                fill={colors[3]}
            />
        </Group>
    )
}

export default TypeDial;