import {useState} from "react";
import {Circle, Group, Rect} from "react-konva";
import {CustomAnimatedDropdownButton} from "./CustomButtons.tsx";
import Konva from "konva";


type ExecutionPaneProps = {
    x: number
    y: number
    width: number
    initialHeight: number
    maxHeight: number,
    minHeight: number
}

const ExecutionPane: React.FC<ExecutionPaneProps> = ({x, y, width, initialHeight, maxHeight, minHeight}) => {
    const [height, setHeight] = useState(initialHeight)
    const [paneCollapsed, setPaneCollapsed] = useState(0)

    const BAR_HEIGHT = 20;

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
            y={paneCollapsed ? y-BAR_HEIGHT : y-height}
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
                            x={width/2 + (i-1)*8}
                            y={BAR_HEIGHT/2}
                            radius={3}
                            fill="gray"
                        />
                    ))
                }
            </Group>
            <CustomAnimatedDropdownButton x={width-20} y={2.5} size={15} onClick={handleDropdownClicked} status={paneCollapsed}/>
        </Group>
    )
}

export default ExecutionPane