import React, {useEffect, useState} from "react";
import {Arc, Circle, Group, Line, Rect, RegularPolygon, Text} from "react-konva";
import Konva from "konva";
import {Spinner} from "./TestViewer.tsx";

type CustomButtonProps = {
    x: number;
    y: number;
    size: number;
    onClick: () => void;
}

const CustomPlayButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <RegularPolygon
                x={size/2}
                y={size/2}
                sides={3}
                radius={size/3}
                fill="white"
                rotation={90}
            />
        </Group>
    );
}

const CustomDropdownButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <Line
                points={[size/4, 2*size/5, size/2, 13*size/20, 3*size/4, 2*size/5]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomMenuButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <Circle
                x={size/2}
                y={size/4}
                radius={size/12}
                fill="white"
            />
            <Circle
                x={size/2}
                y={size/2}
                radius={size/12}
                fill="white"
            />
            <Circle
                x={size/2}
                y={3*size/4}
                radius={size/12}
                fill="white"
            />
        </Group>
    );
}

const CustomOperatorButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <Arc
                x={size/3}
                y={size/2}
                innerRadius={0}
                outerRadius={size/5}
                angle={180}
                fill="white"
                rotation={-90}
            />
            <Arc
                x={size/2}
                y={size/2}
                innerRadius={0}
                outerRadius={size/5}
                angle={180}
                fill="white"
                rotation={-90}
            />
        </Group>
    );
}

const InequalitySign: React.FC<{x: number, y: number, size: number, flip: boolean}> = ({ x, y, size, flip}) => {
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
                points={[x1, 0, x2, -base/2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
            <Line
                points={[x1, 0, x2, base/2]}
                stroke="white"
                strokeWidth={strokeWidth}
            />
            <Circle
                x={x1}
                y={0}
                radius={strokeWidth/2}
                fill="white"
            />
        </Group>
    );
}

const CustomCodeButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
    let signWidth = 2*size/3
    let signGap = size/4
    let signSize = (signWidth - signGap)/2
    let signX1 = (size - signWidth)/2
    let signX2 = signX1 + signGap + signSize
    let signY = size/2

    let slashHeight = size/2
    let slashWidth = size/4

    let slashX1 = size/2 - slashWidth/2
    let slashX2 = size/2 + slashWidth/2
    let slashY1 = signY + slashHeight/2
    let slashY2 = signY - slashHeight/2

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
                cornerRadius={size/2}
            />
            <InequalitySign x={signX1} y={signY} size={signSize} flip={false}/>
            <InequalitySign x={signX2} y={signY} size={signSize} flip={true}/>
            <Line
                points={[slashX1, slashY1, slashX2, slashY2]}
                stroke="white"
                strokeWidth={signSize/3}
            />
        </Group>
    );
}

// todo add spinner state to button itself
const CustomTableButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
    let tableHeight = size/2
    let tableWidth = size/2

    let centerX = size/2
    let centerY = size/2

    let tableX = centerX - tableWidth/2
    let tableY = centerY - tableHeight/2

    let columnCount = 2
    let rowCount = 3

    let columnWidth = tableWidth / columnCount
    let rowHeight = tableHeight / rowCount

    let strokeWidth = size/20

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
                cornerRadius={size/2}
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
                    radius={strokeWidth/2}
                    fill="white"
                />
                <Circle
                    x={tableWidth}
                    y={0}
                    radius={strokeWidth/2}
                    fill="white"
                />
                <Circle
                    x={0}
                    y={tableHeight}
                    radius={strokeWidth/2}
                    fill="white"
                />
                <Circle
                    x={tableWidth}
                    y={tableHeight}
                    radius={strokeWidth/2}
                    fill="white"
                />
            </Group>
        </Group>
    );
}

type CustomAnimatedTableButtonProps = CustomButtonProps & {
    x: number;
    y: number;
    size: number;
    onClick: () => void;
    status: number;
}



const CustomAnimatedTableButton: React.FC<CustomAnimatedTableButtonProps> = ({ x, y, size, onClick, status }) => {
    const [spinnerPosition, setSpinnerPosition] = useState<number>(0);

    useEffect(() => {
        if (status === 0) {
            let anim = new Konva.Animation((frame) => {
                setSpinnerPosition( (prev) => prev + 5 % 360);
            });
            anim.start();
            return () => {
                anim.stop()
            };
        } else {
            return;
        }
    }, [status]);

    // status === 0 means loading
    // status === 1 means success
    // status === 2 means error
    return (
        <Group
            x={x}
            y={y}
            onClick={onClick}
        >
            <CustomTableButton x={0} y={0} size={size} onClick={onClick}/>
            { status === 0 && <Spinner x={size / 2} y={0} size={size / 2} degrees={spinnerPosition}/> }
            {/*(status === 1) && <CustomPlayButton x={size/2} y={-size/2} size={size/4} onClick={onClick}/>*/}
            {/*(status === 2) && <CustomXButton x={size/2} y={-size/2} size={size/4} onClick={onClick}/>*/}
        </Group>
    );
}

const CustomPlusButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <Line
                points={[size/4, size/2, 3*size/4, size/2]}
                stroke="white"
                strokeWidth={4}
            />
            <Line
                points={[size/2, size/4, size/2, 3*size/4]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomXButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
                cornerRadius={size/2}
            />
            <Line
                points={[size/4, size/4, 3*size/4, 3*size/4]}
                stroke="white"
                strokeWidth={4}
            />
            <Line
                points={[3*size/4, size/4, size/4, 3*size/4]}
                stroke="white"
                strokeWidth={4}
            />
        </Group>
    );
}

const CustomAnimatedPlusButton: React.FC<CustomButtonProps> = ({ x, y, size, onClick }) => {
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
            ): (
                <>
                    <Rect
                        x={-size*0.05}
                        y={-size*0.05 - size*6.1/2}
                        width={size * 1.1}
                        height={size * 4.15}
                        fill="#86BBBD"
                        cornerRadius={size*1.1/2}
                    />
                    <CustomPlusButton x={-size*0.05} y={-size*0.05} size={size * 1.1} onClick={onClick}/>
                    <CustomPlayButton x={size*0.1} y={-size} size={size*.8} onClick={onClick}/>
                    <CustomDropdownButton x={size*0.1} y={-size*2} size={size*.8} onClick={onClick}/>
                    <CustomMenuButton x={size*0.1} y={-size*3} size={size*.8} onClick={onClick}/>
                </>
            )}
        </Group>
    );
};

export {CustomPlayButton, CustomXButton, CustomAnimatedTableButton, CustomPlusButton, CustomTableButton, CustomCodeButton, CustomAnimatedPlusButton, CustomDropdownButton, CustomMenuButton, CustomOperatorButton};