/* globals describe it expect afterEach beforeEach */
/* eslint-disable no-duplicate-imports */
import React from "react";
import R from "ramda";
import {DetailTab} from "../../main/steps/DetailTab.es6";
import * as subject from "../../main/steps/DetailTab.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {shallow, mount} from "enzyme";
import "jasmine-expect-jsx";

const takeFirst = R.take(1);
const takeLast = R.takeLast(1);


describe("Artifacts tab", () => {

    const realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should render detail tab", () => {
        const component = shallow(<DetailTab details={[]}/>);
        expect((component.find(".detailTab")).length).toBe(1);
    });

    it("should render two links", () => {
        const artifactDetailsWithTwoLinks =
            [
                {
                    label: "first.txt",
                    href: "/artifacts/6/2-1/first.txt"
                },
                {
                    label: "second.txt",
                    href: "/artifacts/6/2-1/second.txt"
                }
            ];

        const component = mount(<DetailTab details={artifactDetailsWithTwoLinks}/>);


        const links = component.find(".buildStepLayer__detail-tab-link");
        const firstLink = takeFirst(links);
        const secondLink = takeLast(links);


        expect(firstLink.text()).toEqual("first.txt");
        expect(firstLink.prop("href")).toEqual("/artifacts/6/2-1/first.txt");

        expect(secondLink.text()).toEqual("second.txt");
        expect(secondLink.prop("href")).toEqual("/artifacts/6/2-1/second.txt");
    });

    it("should render label without href", () => {
        const artifactDetail =
            [
                {
                    label: "first.txt"
                }
            ];
        const component = mount(<DetailTab details={artifactDetail}/>);

        expect(component.find(".buildStepLayer__detail-tab-label").text()).toEqual("first.txt");
    });

    it("should render sublists", () => {
        const artifactDetail =
            [
                {
                    label: "megalabel",
                    details: [
                        {
                            label: "inner.txt",
                            href: "/artifacts/6/2-1/inner.txt"
                        }
                    ]
                }
            ];
        const component = mount(<DetailTab details={artifactDetail}/>);


        expect(component.find(".buildStepLayer__detail-tab-label").text()).toEqual("megalabel");
        expect(component.find(".buildStepLayer__detail-tab-link").text()).toEqual("inner.txt");
        expect(component.find(".buildStepLayer__detail-tab-link").prop("href")).toEqual("/artifacts/6/2-1/inner.txt");
    });
});

describe("Redux mapping", () => {
    it("should map rootLabel content to props", () => {
        const state = {
            buildDetails: {
                42: {
                    steps: [
                        {
                            stepId: "2-3-1",
                            details: [
                                {
                                    label: "megalabel",
                                    details: [
                                        {
                                            label: "inner.txt",
                                            href: "/artifacts/6/2-1/inner.txt"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        };
        const initialProps = {buildId: 42, stepId: "2-3-1", rootLabel: "megalabel"};

        const mappedProps = subject.mapStateToProps(state, initialProps);

        expect(mappedProps).toEqual({details: [{label: "inner.txt", href: "/artifacts/6/2-1/inner.txt"}]});
    });

    it("should return empty list for non-existing root label", () => {
        const state = {
            buildDetails: {
                42: {
                    steps: [
                        {
                            stepId: "2-3-1",
                            details: [
                                {
                                    label: "labelo",
                                    details: [
                                        {
                                            label: "inner.txt",
                                            href: "/artifacts/6/2-1/inner.txt"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        };
        const initialProps = {buildId: 42, stepId: "2-3-1", rootLabel: "otherlabel"};

        const mappedProps = subject.mapStateToProps(state, initialProps);

        expect(mappedProps).toEqual({details: []});

    });
});