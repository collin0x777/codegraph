import React, {useState} from "react";
import {Arc, Circle, Group, Line, Rect, RegularPolygon} from "react-konva";

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

export {CustomPlayButton, CustomPlusButton, CustomAnimatedPlusButton, CustomDropdownButton, CustomMenuButton, CustomOperatorButton};