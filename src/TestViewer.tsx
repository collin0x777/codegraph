import React, {useEffect, useRef, useState} from "react";
import {Arc, Group, Line, Rect, Text} from "react-konva";
import {Html} from "react-konva-utils";
import Konva from "konva";
import Animation = Konva.Animation;
import {Spinner} from "./CustomIcons.tsx";

export type TestCase = {
    inputs: string[];
    output: string;
    result: string | null;
}

export type Tests = {
    testCases: TestCase[];
    inputFieldNames: string[];
}

type TestViewerProps = {
    tests: Tests | null;
    width: number;
    height: number;
}

const TestViewer: React.FC<TestViewerProps> = ({tests, width, height}) => {
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
                { (tests === null || tests.testCases.length === 0) ? (
                    <Text x={0} y={0} text={"No test cases"}/>
                ): (
                    <TestTable tests={tests} width={innerWidth} height={innerHeight}/>
                )}
            </Group>
        </Group>
    );
};

type TestTableProps = {
    tests: Tests;
    width: number;
    height: number;
}

const TestTable: React.FC<TestTableProps> = ({tests, width, height}) => {
    let columns = tests.inputFieldNames.length + 2;
    let rows = tests.testCases.length + 1;

    let columnWidth = width / columns;
    let rowHeight = height / rows;

    let strokeWidth = 1;
    let cellMargin = 3;

    const [spinnerPosition, setSpinnerPosition] = useState<number>(0);

    useEffect(() => {
        if (tests.testCases.some((testCase) => testCase.result === null)) {
            let anim = new Animation((frame) => {
                setSpinnerPosition( (prev) => prev + 5 % 360);
            });
            anim.start();
            return () => {
                anim.stop()
            };
        } else {
            return;
        }
    }, [...tests.testCases, tests.testCases.length]);

    return (
        <>
            { // column lines
                Array.from({length: columns - 1}, (_, i) => i + 1).map((i) => {
                    return (
                        <Line
                            key={`column-${i}`}
                            points={[i * columnWidth, 0, i * columnWidth, height]}
                            stroke="black"
                            strokeWidth={(i >= columns - 2) ? strokeWidth * 2 : strokeWidth}
                        />
                    )
                })
            }
            { // row lines
                Array.from({length: rows - 1}, (_, i) => i + 1).map((i) => {
                    return (
                        <Line
                            key={`row-${i}`}
                            points={[0, i * rowHeight, width, i * rowHeight]}
                            stroke="black"
                            strokeWidth={(i === 1) ? strokeWidth * 2 : strokeWidth}
                        />
                    )
                })
            }
            { // input field names
                [...tests.inputFieldNames, "expected", "output"].map((name, index) => {
                    return (
                        <Text key={`field-${index}`} x={columnWidth * (index) + cellMargin} y={cellMargin} text={name}/>
                    );
                })
            }
            { // test cases
                tests.testCases.map((testCase, caseIndex) => {
                    return (
                        <Group key={caseIndex}>
                            {testCase.inputs.map((input, fieldIndex) => {
                                return (
                                    <Text key={fieldIndex} x={columnWidth * (fieldIndex) + cellMargin}
                                          y={rowHeight * (caseIndex + 1) + cellMargin} text={input}/>
                                );
                            })}
                            <Text x={columnWidth * (testCase.inputs.length) + cellMargin}
                                  y={rowHeight * (caseIndex + 1) + cellMargin} text={testCase.output}/>

                            { (testCase.result) ? (
                                <Text fill={(testCase.output === testCase.result ? "green" : "red")}
                                      x={columnWidth * (testCase.inputs.length + 1) + cellMargin}
                                      y={rowHeight * (caseIndex + 1) + cellMargin} text={testCase.result}/>
                            ): (
                                <Spinner
                                    x={columnWidth * (testCase.inputs.length + 1) + cellMargin}
                                    y={rowHeight * (caseIndex + 1) + cellMargin}
                                    size={rowHeight - cellMargin * 2}
                                    degrees={spinnerPosition}/>
                            )
                            }
                        </Group>
                    );
                })
            }
        </>
    );
}

export default TestViewer;