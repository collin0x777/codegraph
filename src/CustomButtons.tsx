import React, {useEffect, useState} from "react";
import {Arc, Circle, Group, Line, Rect, RegularPolygon} from "react-konva";
import Konva from "konva";
import {Spinner, StatusIndicator} from "./CustomIcons.tsx";

type CustomButtonProps = {
    x: number;
    y: number;
    size: number;
    onClick: () => void;
}

const CustomPlayButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <RegularPolygon
                x={size / 2}
                y={size / 2}
                sides={3}
                radius={size / 3}
                fill="white"
                rotation={90}
            />
        </Group>
    );
}

const CustomStopButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Rect
                x={size / 4}
                y={size / 4}
                width={size / 2}
                height={size / 2}
                fill="white"
            />
        </Group>
    );
}

const CustomPauseButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    let gap = size / 4;
    let strokeWidth = size / 10;
    let height = size / 2;

    let x1 = (size - gap) / 2;
    let x2 = (size + gap) / 2;

    let y1 = (size - height) / 2;
    let y2 = y1 + height;

    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Line
                points={[x1, y1, x1, y2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
            <Line
                points={[x2, y1, x2, y2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
        </Group>
    );
}

const CustomRestartButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    let strokeWidth = size / 12;
    let outerRadius = size / 4;
    let innerRadius = outerRadius - strokeWidth;
    let triangleHeight = size / 8;

    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Arc
                x={size / 2}
                y={size / 2}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                angle={270}
                fill="white"
            />
            <RegularPolygon
                sides={3}
                radius={triangleHeight}
                fill="white"
                x={size / 2}
                y={size / 2 - outerRadius + (strokeWidth / 2)}
                rotation={90}
            />
        </Group>
    );
}

const CustomAnimatedPlayButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const playButtonClicked = () => {
        setIsPlaying(true);
        onClick();
    }

    const stopButtonClicked = () => {
        setIsPlaying(false);
        onClick();
    }

    return (
        <Group
            x={x}
            y={y}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!isPlaying ? (
                <CustomPlayButton x={0} y={0} size={size} onClick={playButtonClicked}/>
            ) : (
                !isHovered ? (
                    <CustomPauseButton x={0} y={0} size={size} onClick={stopButtonClicked}/>
                ) : (
                    <>
                        <Rect
                            x={-size * 0.05}
                            y={-size * 0.05 - size * 6.1 / 2}
                            width={size * 1.1}
                            height={size * 4.15}
                            fill="#86BBBD"
                            cornerRadius={size * 1.1 / 2}
                        />
                        <CustomPauseButton x={-size * 0.05} y={-size * 0.05} size={size * 1.1} onClick={stopButtonClicked}/>
                        <CustomStopButton x={size * 0.1} y={-size} size={size * .8} onClick={stopButtonClicked}/>
                        <CustomRestartButton x={size * 0.1} y={-size * 2} size={size * .8} onClick={stopButtonClicked}/>
                    </>
                )
            )}
        </Group>
    );
}

const CustomDropdownButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Line
                points={[size / 4, 2 * size / 5, size / 2, 13 * size / 20, 3 * size / 4, 2 * size / 5]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomMenuButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Circle
                x={size / 2}
                y={size / 4}
                radius={size / 12}
                fill="white"
            />
            <Circle
                x={size / 2}
                y={size / 2}
                radius={size / 12}
                fill="white"
            />
            <Circle
                x={size / 2}
                y={3 * size / 4}
                radius={size / 12}
                fill="white"
            />
        </Group>
    );
}

const CustomOperatorButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Arc
                x={size / 3}
                y={size / 2}
                innerRadius={0}
                outerRadius={size / 5}
                angle={180}
                fill="white"
                rotation={-90}
            />
            <Arc
                x={size / 2}
                y={size / 2}
                innerRadius={0}
                outerRadius={size / 5}
                angle={180}
                fill="white"
                rotation={-90}
            />
        </Group>
    );
}

const InequalitySign: React.FC<{ x: number, y: number, size: number, flip: boolean }> = ({x, y, size, flip}) => {
    let angle = 55;

    // the height of the triangle is `size`
    let base = 2 * size * Math.tan(angle * Math.PI / 360);

    let strokeWidth = size / 3

    let x1 = flip ? size : 0;
    let x2 = flip ? 0 : size;

    return (
        <Group
            x={x}
            y={y}
        >
            <Line
                points={[x1, 0, x2, -base / 2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
            <Line
                points={[x1, 0, x2, base / 2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
            <Circle
                x={x1}
                y={0}
                radius={strokeWidth / 2}
                fill="white"
            />
        </Group>
    );
}

const CustomCodeButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    let signWidth = 2 * size / 3
    let signGap = size / 4
    let signSize = (signWidth - signGap) / 2
    let signX1 = (size - signWidth) / 2
    let signX2 = signX1 + signGap + signSize
    let signY = size / 2

    let slashHeight = size / 2
    let slashWidth = size / 4

    let slashX1 = size / 2 - slashWidth / 2
    let slashX2 = size / 2 + slashWidth / 2
    let slashY1 = signY + slashHeight / 2
    let slashY2 = signY - slashHeight / 2

    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <InequalitySign x={signX1} y={signY} size={signSize} flip={false}/>
            <InequalitySign x={signX2} y={signY} size={signSize} flip={true}/>
            <Line
                points={[slashX1, slashY1, slashX2, slashY2]}
                stroke="white"
                strokeWidth={signSize / 3}
            />
        </Group>
    );
}

// todo add spinner state to button itself
const CustomTableButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    let tableHeight = size / 2
    let tableWidth = size / 2

    let centerX = size / 2
    let centerY = size / 2

    let tableX = centerX - tableWidth / 2
    let tableY = centerY - tableHeight / 2

    let columnCount = 2
    let rowCount = 3

    let columnWidth = tableWidth / columnCount
    let rowHeight = tableHeight / rowCount

    let strokeWidth = size / 20

    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Group x={tableX} y={tableY}>
                {
                    Array.from({length: columnCount + 1}, (_, i) => i).map((i) => {
                        return (
                            <Line
                                key={i}
                                points={[i * columnWidth, 0, i * columnWidth, tableHeight]}
                                stroke="white"
                                strokeWidth={strokeWidth}
                            />
                        )
                    })
                }
                {
                    Array.from({length: rowCount + 1}, (_, i) => i).map((i) => {
                        return (
                            <Line
                                key={i}
                                points={[0, i * rowHeight, tableWidth, i * rowHeight]}
                                stroke="white"
                                strokeWidth={strokeWidth}
                            />
                        )
                    })
                }
                <Circle
                    x={0}
                    y={0}
                    radius={strokeWidth / 2}
                    fill="white"
                />
                <Circle
                    x={tableWidth}
                    y={0}
                    radius={strokeWidth / 2}
                    fill="white"
                />
                <Circle
                    x={0}
                    y={tableHeight}
                    radius={strokeWidth / 2}
                    fill="white"
                />
                <Circle
                    x={tableWidth}
                    y={tableHeight}
                    radius={strokeWidth / 2}
                    fill="white"
                />
            </Group>
        </Group>
    );
}

type CustomAnimatedButtonProps = CustomButtonProps & {
    status: number;
}


const CustomAnimatedTableButton: React.FC<CustomAnimatedButtonProps> = ({x, y, size, onClick, status}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <CustomTableButton x={0} y={0} size={size} onClick={() => {}}/>
            <StatusIndicator x={size / 2} y={0} size={size / 2} status={status}/>
        </Group>
    );
}

const CustomPlusButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Line
                points={[size / 4, size / 2, 3 * size / 4, size / 2]}
                stroke="white"
                strokeWidth={4}
            />
            <Line
                points={[size / 2, size / 4, size / 2, 3 * size / 4]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomXButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Line
                points={[size / 4, size / 4, 3 * size / 4, 3 * size / 4]}
                stroke="white"
                strokeWidth={4}
            />
            <Line
                points={[3 * size / 4, size / 4, size / 4, 3 * size / 4]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomAnimatedPlusButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Group
            x={x}
            y={y}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!isHovered ? (
                <CustomPlusButton x={0} y={0} size={size} onClick={onClick}/>
            ) : (
                <>
                    <Rect
                        x={-size * 0.05}
                        y={-size * 0.05 - size * 6.1 / 2}
                        width={size * 1.1}
                        height={size * 4.15}
                        fill="#86BBBD"
                        cornerRadius={size * 1.1 / 2}
                    />
                    <CustomPlusButton x={-size * 0.05} y={-size * 0.05} size={size * 1.1} onClick={onClick}/>
                    <CustomPlayButton x={size * 0.1} y={-size} size={size * .8} onClick={onClick}/>
                    <CustomDropdownButton x={size * 0.1} y={-size * 2} size={size * .8} onClick={onClick}/>
                    <CustomMenuButton x={size * 0.1} y={-size * 3} size={size * .8} onClick={onClick}/>
                </>
            )}
        </Group>
    );
};

const CustomBuildButton: React.FC<CustomButtonProps> = ({x, y, size, onClick}) => {

    let length = 2 * size / 5
    let offset1a = 7 * size / 20
    let offset1b = offset1a + length

    let offset2 = size / 5

    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <Rect
                width={size}
                height={size}
                fill="#5F506B"
                cornerRadius={size / 2}
            />
            <Line
                points={[offset1a, offset1a, offset1b, offset1b]}
                stroke="white"
                strokeWidth={3}
            />
            <Line
                points={[offset1a + offset2, offset1a - offset2, offset1a - offset2, offset1a + offset2]}
                stroke="white"
                strokeWidth={3}
            />
        </Group>
    );
}

const CustomAnimatedBuildButton: React.FC<CustomAnimatedButtonProps> = ({x, y, size, onClick, status }) => {
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <CustomBuildButton x={0} y={0} size={size} onClick={() => {}}/>
            <StatusIndicator x={size / 2} y={0} size={size / 2} status={status}/>
        </Group>
    )
}

export {
    CustomPlayButton,
    CustomAnimatedPlayButton,
    CustomXButton,
    CustomBuildButton,
    CustomAnimatedTableButton,
    CustomPlusButton,
    CustomTableButton,
    CustomCodeButton,
    CustomAnimatedPlusButton,
    CustomAnimatedBuildButton,
    CustomDropdownButton,
    CustomMenuButton,
    CustomOperatorButton
};