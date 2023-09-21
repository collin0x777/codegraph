import React from "react";
import {Circle, Layer} from "react-konva";

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
