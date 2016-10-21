/* globals describe it expect jest beforeEach */
jest.mock("../../BackendNew.es6");
jest.mock("../../App.es6");
import LambdaUI from "../../App.es6";
import {Backend} from "../../BackendNew.es6";
import * as subject from "../BackendActions.es6";


describe("OutputConnection", () => {

  let dispatchMock;
  let backendMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    backendMock = new Backend();
    LambdaUI.backend.mockReturnValue(backendMock);
  });

  describe("Ansync Actions", () => {
      it("should call backend requestOutput", () => {
        subject.requestOutput(1, 2)(dispatchMock);

        expect(backendMock.requestOutput).toBeCalledWith(dispatchMock, 1, 2);
      });

      it("should call backend requestDetails" , () => {
        subject.requestDetails(1)(dispatchMock);

        expect(backendMock.requestDetails).toBeCalledWith(dispatchMock, 1);
      });
  });
});
