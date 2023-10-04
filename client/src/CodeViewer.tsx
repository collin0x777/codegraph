import {Group, Rect, Text} from "react-konva";

type CodeViewerProps = {
    code: string | null;
    width: number;
    height: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({code, width, height}) => {
    let border = 10;
    let margin = 5;

    let innerWidth = width - ((border + margin) * 2);
    let innerHeight = height - (border + margin * 2);

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
                x={border}
                y={0}
                width={width - (border * 2)}
                height={height - border}
                fill="#C0D4D8"
            />
            <Group
                x={border + margin}
                y={margin}
                width={innerWidth}
                height={innerHeight}
            >
                { (code === null) ? (
                    <Text x={0} y={0} text={"No code has been generated yet"}/>
                ): (
                    <Text x={0} y={0} text={code}/>
                )}
            </Group>
        </Group>
    );
};

export default CodeViewer;