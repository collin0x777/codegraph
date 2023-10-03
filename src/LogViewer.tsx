import React, {useEffect, useRef, useState} from "react";
import {Group, Rect, Text} from "react-konva";
import Konva from "konva";

type LogViewerProps = {
    logs: string[];
    width: number;
    height: number;
    margin?: number;
}

const LogViewer: React.FC<LogViewerProps> = ({logs, width, height, margin}) => {
    const containerRef = useRef<any>(null);
    const [scrollbarHover, setScrollbarHover] = useState<boolean>(false);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const marginSize = margin ? margin : 0
    const fontSize = 10
    const lineHeightPx = 11
    const lineHeight = lineHeightPx / fontSize
    const innerWidth = width - (marginSize * 2)
    const innerHeight = height - (marginSize * 2)
    const fontWidthHeightRatio = 1.65
    const scrollbarWidth = 8
    const maxLineWidth = fontWidthHeightRatio * innerWidth / fontSize

    const singleLineLogs = logs.flatMap((log) => {
        const lines = []
        for (let i = 0; i < log.length; i += maxLineWidth) {
            lines.push(log.slice(i, i + maxLineWidth))
        }
        return lines
    })

    const maxScrollPosition = Math.max(singleLineLogs.length * lineHeightPx - innerHeight, 0)
    const scrollbarHeight = (innerHeight ** 2) / (singleLineLogs.length * lineHeightPx)
    const scrollbarX = innerWidth - scrollbarWidth
    const scrollbarY = (scrollPosition / maxScrollPosition) * (innerHeight - scrollbarHeight)
    const scrollRatio = maxScrollPosition / (innerHeight - scrollbarHeight)

    useEffect(() => {
        // Adjust scroll position to the bottom when logs change
        setScrollPosition(maxScrollPosition)
    }, [logs, height, maxScrollPosition]);

    const handleMouseWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.stopPropagation()
        e.evt.stopImmediatePropagation()
        e.cancelBubble = true

        setScrollPosition((scrollPos) => {
            return Math.max(0, Math.min(scrollPos + e.evt.deltaY, maxScrollPosition))
        })
    }

    const onScrollbarDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true
        e.target.x(0)
        e.target.y(0)
        setScrollPosition((scrollPos) => {
            return Math.max(0, Math.min(scrollPos + (e.evt.movementY * scrollRatio), maxScrollPosition))
        })
    }

    const onScrollbarHover = (e: Konva.KonvaEventObject<MouseEvent>) => {
        setScrollbarHover(true)
    }

    const onScrollbarHoverEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
        setScrollbarHover(false)
    }

    return (
        <Group
            ref={containerRef}
            x={marginSize}
            y={marginSize}
            width={innerWidth}
            height={innerHeight}
            clipX={0}
            clipY={0}
            clipWidth={innerWidth}
            clipHeight={innerHeight}
            onWheel={handleMouseWheel}
        >
            <Rect
                width={innerWidth}
                height={innerHeight}
            />
            {
                singleLineLogs.map((log, index) => (
                    <Text
                        key={index}
                        text={log}
                        fontSize={fontSize}
                        fontFamily="monospace"
                        y={index * lineHeightPx - scrollPosition}
                        lineHeight={lineHeight}
                    />
                ))
            }
            {
                (maxScrollPosition > 0) ? (
                <Group
                    x={scrollbarX}
                    y={scrollbarY}
                >
                    <Rect
                        width={scrollbarWidth}
                        height={scrollbarHeight}
                        draggable={true}
                        onDragMove={onScrollbarDragMove}
                        opacity={scrollbarHover ? 1 : 0.5}
                        fill={'#8f8f8f'}
                        onMouseEnter={onScrollbarHover}
                        onMouseLeave={onScrollbarHoverEnd}
                    />
                </Group>
                ) : null
            }
        </Group>
    );
}

const BorderedLogViewer: React.FC<LogViewerProps> = ({ logs, width, height }) => {

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
                x={10}
                y={0}
            >
                <LogViewer logs={logs} width={width-20} height={height-10} margin={5}/>
            </Group>
        </Group>
    );
};

export {BorderedLogViewer, LogViewer};