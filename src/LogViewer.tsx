import React, {useRef} from "react";
import {Group, Rect} from "react-konva";
import {Html} from "react-konva-utils";

type LogViewerProps = {
    logs: string[];
    width: number;
    height: number;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, width, height }) => {

    const containerRef = useRef<HTMLDivElement>(null);

    // todo: use this
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    return (
        <Group
            height={height}
            width={width}
        >
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="#86BBBD"
            />
            <Rect
                x={10}
                y={0}
                width={width - 20}
                height={height - 10}
                fill="#C0D4D8"
            />
            <Group
                x={15}
                y={5}
                width={width - 30}
                height={height - 20}
            >
                <Html>
                    <div
                        style={{
                            height: height - 20,
                            width: width - 30,
                            overflowY: 'scroll',
                            fontSize: 12,
                        }}
                        ref={containerRef}
                    >
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </Html>
            </Group>
        </Group>
    );
};

export default LogViewer;