/* globals describe it expect jest*/
jest.mock("../Backend.es6");
import * as Actions from "../Actions.es6";
import * as Backend from "../Backend.es6";


describe("Actions creators", () => {
  it("should create a correct viewBuildStep Action", () => {
    const action = Actions.viewBuildStep(1, 2);

    expect(action).toEqual({type: "viewBuildStep", buildId: 1, stepId: 2});
  });
});

describe("Async actions", () => {


  it("should call backend on request output", () => {
    const dispatchMock = jest.fn();
    const buildId = 1, stepId = 2;
    const requestOutputMock = jest.fn();
    Backend.requestOutput.mockReturnValue(requestOutputMock);

    Actions.requestOutput(buildId, stepId)(dispatchMock);

    expect(Backend.requestOutput).toBeCalledWith(dispatchMock);
    expect(requestOutputMock).toBeCalledWith(buildId, stepId);
  });
});
