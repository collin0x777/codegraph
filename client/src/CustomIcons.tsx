import React, {useEffect, useState} from "react";
import {Arc, Group, Line} from "react-konva";
import Konva from "konva";

const Checkmark: React.FC<{x: number, y: number, size: number}> = ({x, y, size}) => {
    return (
        <Group
            x={x}
            y={y}
            >
            <Line
                points={[0, size/2, size/2, size, 3*size/2, 0]}
                stroke={"green"}
                strokeWidth={size/4}
            />
        </Group>
    )
}

const Cross: React.FC<{x: number, y: number, size: number}> = ({x, y, size}) => {
    let strokeWidth = size/4;

    return (
        <Group
            x={x}
            y={y}
        >
            <Line
                points={[0, 0, size, size]}
                stroke={"red"}
                strokeWidth={strokeWidth}
            />
            <Line
                points={[0, size, size, 0]}
                stroke={"red"}
                strokeWidth={strokeWidth}
            />
        </Group>
    )
}

const Spinner: React.FC<{x: number, y: number, size: number, degrees: number}> = ({x, y, size, degrees}) => {
    let outerRadius = size/2;
    let innerRadius = 2*outerRadius/3;

    return (
        <Arc x={x + outerRadius} y={y + outerRadius} angle={90} innerRadius={innerRadius} outerRadius={outerRadius} rotation={degrees} fill={"gray"}/>
    );
}

// status: 0 = not run, 1 = running, 2 = passed, 3 = failed
const StatusIndicator: React.FC<{x: number, y: number, size: number, status: number}> = ({x, y, size, status}) => {
    const [spinnerPosition, setSpinnerPosition] = useState<number>(0);

    useEffect(() => {
        if (status === 1) {
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

    switch (status) {
        case 0:
            return null;
        case 1:
            return <Spinner x={x} y={y} size={size} degrees={spinnerPosition}/>;
        case 2:
            return <Checkmark x={x} y={y} size={2*size/3}/>
        case 3:
            return <Cross x={x} y={y+size/4} size={2*size/3}/>
        default:
            return null;
    }
}


export { Spinner, StatusIndicator };