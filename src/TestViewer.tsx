import React, {useEffect, useRef, useState} from "react";
import {Arc, Group, Line, Rect, Text} from "react-konva";
import {Html} from "react-konva-utils";
import Konva from "konva";
import Animation = Konva.Animation;

export type TestCase = {
    inputs: string[];
    output: string;
}

export type Tests = {
    testCases: TestCase[];
    inputFieldNames: string[];
}

type TestViewerProps = {
    tests: Tests;
    results: (string | null)[];
    width: number;
    height: number;
}

export const Spinner: React.FC<{x: number, y: number, size: number, degrees: number}> = ({x, y, size, degrees}) => {
    let outerRadius = size/2;
    let innerRadius = 2*outerRadius/3;

    return (
        <Arc x={x + outerRadius} y={y + outerRadius} angle={90} innerRadius={innerRadius} outerRadius={outerRadius} rotation={degrees} fill={"gray"}/>
    );
}

const TestViewer: React.FC<TestViewerProps> = ({tests, results, width, height}) => {
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
                { (tests.testCases.length === 0) ? (
                    <Text x={0} y={0} text={"No test cases"}/>
                ): (
                    <TestTable tests={tests} results={results} width={innerWidth} height={innerHeight}/>
                )}
            </Group>
        </Group>
    );
};

type TestTableProps = {
    tests: Tests;
    results: (string | null)[];
    width: number;
    height: number;
}

const TestTable: React.FC<TestTableProps> = ({tests, results, width, height}) => {
    let columns = tests.inputFieldNames.length + 2;
    let rows = tests.testCases.length + 1;

    let columnWidth = width / columns;
    let rowHeight = height / rows;

    let strokeWidth = 1;
    let cellMargin = 3;

    const [spinnerPosition, setSpinnerPosition] = useState<number>(0);

    useEffect(() => {
        if (results.includes(null)) {
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
    }, [...results, results.length]);

    return (
        <>
            { // column lines
                Array.from({length: columns - 1}, (_, i) => i + 1).map((i) => {
                    return (
                        <Line
                            // key={i}
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
                            // key={i}
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
                        <Text x={columnWidth * (index) + cellMargin} y={cellMargin} text={name}/>
                    );
                })
            }
            { // test cases
                tests.testCases.map((testCase, caseIndex) => {
                    return (
                        <Group>
                            {testCase.inputs.map((input, fieldIndex) => {
                                return (
                                    <Text x={columnWidth * (fieldIndex) + cellMargin}
                                          y={rowHeight * (caseIndex + 1) + cellMargin} text={input}/>
                                );
                            })}
                            <Text x={columnWidth * (testCase.inputs.length) + cellMargin}
                                  y={rowHeight * (caseIndex + 1) + cellMargin} text={testCase.output}/>

                            { (results[caseIndex]) ? (
                                <Text fill={(testCase.output === results[caseIndex] ? "green" : "red")}
                                      x={columnWidth * (testCase.inputs.length + 1) + cellMargin}
                                      y={rowHeight * (caseIndex + 1) + cellMargin} text={results[caseIndex]!}/>
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