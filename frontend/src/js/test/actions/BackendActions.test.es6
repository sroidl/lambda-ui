/* globals describe it expect jest beforeEach afterEach */
jest.mock("../../main/Backend.es6");
jest.mock("../../main/App.es6");
jest.mock("../../main/Utils.es6");
import LambdaUI from "../../main/App.es6";
import {Backend} from "../../main/Backend.es6";
import * as subject from "../../main/actions/BackendActions.es6";
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
            });
        });
    }
)
;