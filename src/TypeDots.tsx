import React from 'react';
import {Group, Circle, Text, Rect} from 'react-konva';

type TypeDotsProps = {
    x: number;
    y: number;
    radius: number;
    params: {name: string, type: string}[];
    flip: boolean;
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

const getArcOffset = (radius: number, index: number, count: number) => {
    let minOffsetAngle = 35;
    let maxTotalAngle = 135;
    let offsetAngle = Math.min(minOffsetAngle, maxTotalAngle / Math.max(1, count - 1));
    let totalAngle = offsetAngle * (count - 1);

    let degrees = index * offsetAngle;
    let degreesOffset = (180 - totalAngle) / 2;
    let radians = (degrees + degreesOffset) * (Math.PI / 180);

    let offsetX = radius * Math.sin(radians);
    let offsetY = radius * Math.cos(radians);

    return { offsetX, offsetY };
}

const TypeDots: React.FC<TypeDotsProps> = ({ x, y, radius, params, flip }) => {
    let colors = params === null ? [] : params.map(param => typeToColors(param.type)[0]);
    let numDots = colors.length;
    let dotRadius = radius / 5;

    return (
        <Group
            x={x}
            y={y}
        >
            {
                colors.map((color, index) => {
                    let offsets = getArcOffset(radius, index, numDots);

                    return (
                        <Circle
                            key={index}
                            x={0}
                            y={0}
                            radius={dotRadius}
                            fill={color}
                            offsetX={(flip ? -1 : 1) * offsets.offsetX}
                            offsetY={offsets.offsetY}
                        />
                    )
                })
            }
        </Group>
    );
}

const NamedTypeDot: React.FC<{x: number, y: number, radius: number, name: string, fill: string}> = ({x, y, radius, name, fill}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const fontSize = radius * 1.5;
    const width = fontSize * name.length;
    const height = fontSize * 1.5;

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    return (
        <Group
            x={x}
            y={y}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {
                isHovered ? (
                    <>
                        <Rect
                            x={-width/2}
                            y={-height/2}
                            width={width}
                            height={height}
                            fill={fill}
                            cornerRadius={radius}
                        />
                        <Text
                            text={name}
                            x={-width/2}
                            y={-height/2}
                            width={width}
                            height={height}
                            fontSize={fontSize}
                            fontFamily={"Arial"}
                            fill={"white"}
                            align={"center"}
                            verticalAlign={"middle"}
                        />
                    </>
                ) : (
                    <Circle
                        x={0}
                        y={0}
                        radius={radius}
                        fill={fill}
                    />
                )
            }
        </Group>
    );
}

// const TypeDots: React.FC<TypeDotsProps> = ({ x, y, radius, params }) => {
//     let namedColors = params === null ? [] : params!.map(param => {
//         return {
//             name: param.name,
//             color: typeToColors(param.type)[0]
//         }
//     });
//     let numDots = namedColors.length;
//     let dotRadius = radius / numDots;
//     let dotSpacing = 3 * radius / numDots;
//
//     return (
//         <Group
//             x={x}
//             y={y}
//         >
//             {
//                 namedColors.map((namedColor, index) => {
//                     return (
//                         <NamedTypeDot
//                             key={index}
//                             x={0}
//                             y={dotSpacing * index - dotSpacing * (numDots - 1) / 2}
//                             radius={dotRadius}
//                             name={namedColor.name}
//                             fill={namedColor.color}
//                         />
//                     )
//                 })
//             }
//         </Group>
//     );
// }

export { TypeDots, getArcOffset };