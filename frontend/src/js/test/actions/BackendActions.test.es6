/* globals describe it expect jest beforeEach afterEach */
jest.mock("../../main/Backend.es6");
jest.mock("../../main/App.es6");
jest.mock("../../main/Utils.es6");
import LambdaUI from "App.es6";
import {Backend} from "Backend.es6";
import * as subject from "actions/BackendActions.es6";
import * as UtilsMock from "Utils.es6";
import {MockStore} from "../testsupport/TestSupport.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BackendActions", () => {

        let realConsole;
        let dispatchMock;
        let backendMock;

        beforeEach(() => {
            TestUtils.consoleThrowingBefore(realConsole);
            dispatchMock = jest.fn();
            backendMock = new Backend();
            LambdaUI.backend.mockReturnValue(backendMock);
        });

        afterEach(() => {
            TestUtils.consoleThrowingAfter(realConsole);
        });

        describe("OutputConnection", () => {


            describe("Ansync Actions", () => {
                it("should call backend requestOutput", () => {
                    subject.requestOutput(1, 2)(dispatchMock);

                    expect(backendMock.requestOutput).toBeCalledWith(dispatchMock, 1, 2);
                });

                it("should call backend requestDetails", () => {
                    subject.requestDetails(1)(dispatchMock);

                    expect(backendMock.requestDetails).toBeCalledWith(dispatchMock, 1);
                });
            });
        });

        describe("requestDetailsPolling", () => {

            const POLLING = 2; // delayMock will callthrough twice, thus simulating polling.
            const BUILD_ID = 1;
            const ONCE = 1;
            let delayMock;

            const setupDelayMock = () => {
                UtilsMock.delay.mockImplementation(() => {
                    return {then: delayMock};
                });

                delayMock.mockImplementationOnce(cb => cb());
            };

            const setupClosedBuild = () => {
                const state = {
                    openedBuilds: {1: false}
                };
                LambdaUI.appStore.mockReturnValue(MockStore(state));
            };

            const setupOpenedBuild = () => {
                const state = {
                    openedBuilds: {1: true}
                };
                LambdaUI.appStore.mockReturnValue(MockStore(state));
            };

            const setupRunning = () => {
                UtilsMock.isBuildRunning.mockReturnValue(true);
            };

            const setupFinished = () => {
                UtilsMock.isBuildRunning.mockReturnValue(false);
            };


            beforeEach(() => {
                delayMock = jest.fn();
                setupDelayMock();
                dispatchMock.mockImplementation(cb => cb(dispatchMock));

            });


            it("should not request twice if build is not open ", () => {
                setupClosedBuild();
                setupRunning();

                subject.requestDetailsPolling(BUILD_ID)(dispatchMock);

                expect(backendMock.requestDetails).toHaveBeenCalledTimes(ONCE);
            });

            it("should poll if build is open and running", () => {
                setupOpenedBuild();
                setupRunning();

                subject.requestDetailsPolling(BUILD_ID)(dispatchMock);

                expect(backendMock.requestDetails).toHaveBeenCalledTimes(POLLING);
            });

            it("should poll if build is open and running", () => {
                setupOpenedBuild();
                setupFinished();

                subject.requestDetailsPolling(BUILD_ID)(dispatchMock);

                expect(backendMock.requestDetails).toHaveBeenCalledTimes(ONCE);
            });

        });
    }
);