import React, {useState} from "react";
import {Arc, Circle, Group, Rect} from "react-konva";
import {CustomAnimatedDropdownButton, CustomAnimatedPlayButton, CustomAnimatedPlusButton} from "./CustomButtons.tsx";
import Konva from "konva";
import {LogViewer} from "./LogViewer.tsx";

type ExecutionPaneProps = {
    x: number
    y: number
    width: number
    initialHeight: number
    maxHeight: number,
    minHeight: number,
    addEditor: () => void
}

const ExecutionPane: React.FC<ExecutionPaneProps> = ({x, y, width, initialHeight, maxHeight, minHeight, addEditor}) => {
    const [height, setHeight] = useState(initialHeight)
    const [paneCollapsed, setPaneCollapsed] = useState(0)
    const [logs, setLogs] = useState<string[]>([
        "Hello, world!",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer.",
        "This is a test of the log viewer."
    ])

    const BAR_HEIGHT = 20;
    const BUTTON_SIZE = 25;
    const BUTTON_MARGIN = 10;
    const BUTTON_Y = -BUTTON_SIZE / 2;

    const LOGS_BOX_MARGIN = 10;
    const LOGS_INNER_MARGIN = 5;
    const LOGS_X = LOGS_BOX_MARGIN
    const LOGS_Y = LOGS_BOX_MARGIN + BAR_HEIGHT
    const LOGS_WIDTH = width - LOGS_BOX_MARGIN * 2;
    const LOGS_HEIGHT = height - BAR_HEIGHT - LOGS_BOX_MARGIN * 2;

    const handleDropdownClicked = () => {
        setPaneCollapsed(paneCollapsed === 0 ? 1 : 0)
    }

    const handlePaneResize = (e: Konva.KonvaEventObject<DragEvent>) => {
        setPaneCollapsed(0)
        setHeight(Math.min(Math.max(y - e.target.absolutePosition().y, BAR_HEIGHT, minHeight), maxHeight))
        e.target.x(0)
        e.target.y(0)
    }

    const handlePaneBarHover = (e: Konva.KonvaEventObject<MouseEvent>) => {
        document.body.style.cursor = "row-resize"
    }

    const handlePaneBarHoverEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
        document.body.style.cursor = "default"
    }

    return (
        <Group
            x={x}
            y={paneCollapsed ? y - BAR_HEIGHT : y - height}
        >
            <Rect
                width={width}
                height={height}
                fill="#76949F"
            />
            <Group
                draggable
                onDragMove={handlePaneResize}
                onDblClick={handleDropdownClicked}
                onMouseEnter={handlePaneBarHover}
                onMouseLeave={handlePaneBarHoverEnd}
            >
                <Rect
                    width={width}
                    height={BAR_HEIGHT}
                    fill="#86BBBD"
                />
                {
                    Array(3).fill(0).map((_, i) => (
                        <Circle
                            key={i}
                            x={width / 2 + (i - 1) * 8}
                            y={BAR_HEIGHT / 2}
                            radius={3}
                            fill="gray"
                        />
                    ))
                }
            </Group>

            <Rect
                x={BUTTON_MARGIN}
                y={-BAR_HEIGHT}
                width={BAR_HEIGHT * 2 + BUTTON_SIZE + BUTTON_MARGIN}
                height={BAR_HEIGHT * 2}
                cornerRadius={BUTTON_SIZE}
                fill="#86BBBD"
            />
            <CustomAnimatedPlusButton x={BUTTON_MARGIN - BUTTON_SIZE / 2 + BAR_HEIGHT}
                                      y={BUTTON_Y}
                                      size={BUTTON_SIZE}
                                      onClick={addEditor}
            />
            <CustomAnimatedPlayButton x={BUTTON_MARGIN * 2 + BUTTON_SIZE / 2 + BAR_HEIGHT}
                                      y={BUTTON_Y}
                                      size={BUTTON_SIZE}
                                      onClick={() => {
                                      }}
            />
            <Arc
                x={width - BAR_HEIGHT - BUTTON_MARGIN}
                y={0}
                innerRadius={0}
                outerRadius={BAR_HEIGHT}
                angle={180}
                rotation={180}
                fill="#86BBBD"
            />
            <CustomAnimatedDropdownButton x={width - BAR_HEIGHT - BUTTON_MARGIN - BUTTON_SIZE / 2} y={BUTTON_Y}
                                          size={BUTTON_SIZE} onClick={handleDropdownClicked} status={paneCollapsed}/>

            <Group
                x={LOGS_X}
                y={LOGS_Y}
            >
                <Rect
                    width={LOGS_WIDTH}
                    height={LOGS_HEIGHT}
                    fill="#C0D4D8"
                />
                <LogViewer logs={logs} width={LOGS_WIDTH} height={LOGS_HEIGHT} margin={LOGS_INNER_MARGIN}/>
            </Group>
        </Group>
    )
}

export default ExecutionPane