/* globals describe it jest expect beforeEach */
jest.mock("../WebSocketFactory.es6");
import {Backend} from "../BackendNew.es6";
import {webSocket} from "../WebSocketFactory.es6";

const _it = () => {};

describe("Backend: output connection", () => {
    _it("should close websocket if output view changes", () => {
        // const webSocketMock = {readystate: 3, close: jest.fn()};
        // webSocket.mockReturnValue(webSocketMock);
        // const requestOutput = subject.outputConnection.requestOutput(jest.fn(), "url");
        //
        // requestOutput(1, 1);
        // requestOutput(1, 2);
        //
        // expect(webSocketMock.close).toBeCalled();
    });
});


describe("New Backend", () => {
    let subject;
    let dispatchMock;
    let websocketMock;

    beforeEach(() => {
      subject = new Backend({baseUrl: "baseUrl"});
      dispatchMock = jest.fn();
      websocketMock = {close : jest.fn()};
      webSocket.mockReturnValue(websocketMock);
    });

    it("should extract baseUrl", () => {
        expect(subject.baseUrl).toBe("baseUrl");
    });

    describe("OutputConnection", () => {
      const OPEN_STATE = 1;

      it("should request output", () => {
          subject.requestOutput(dispatchMock, 1, 2);

          expect(webSocket).toBeCalledWith("ws://baseUrl/builds/1/2");
      });

      it("should close old websocket if new is requested", () => {
        websocketMock.readystate = OPEN_STATE;
        subject.outputConnection = websocketMock;

        subject.requestOutput(dispatchMock, 1, 2);

        expect(websocketMock.close).toBeCalled();
      });

      it("should dispatch new messages to the store", () => {
        subject.requestOutput(dispatchMock, 1, 2);

        websocketMock.onmessage("{\"first\": \"key\"}");

        expect(dispatchMock).toBeCalledWith({type: "addBuildstepOutput", buildId: 1, stepId: 2, output: {first: "key"}});
      });

      it("should dispatch connection state on close", () => {
        subject.requestOutput(dispatchMock, 1, 2);

        websocketMock.onclose();

        expect(dispatchMock).toBeCalledWith({type: "outputConnectionState", state: "closed"});
      });

      it("should dispatch connection state on open", () => {
        subject.requestOutput(dispatchMock, 1, 2);

        websocketMock.onopen();

        expect(dispatchMock).toBeCalledWith({type: "outputConnectionState", state: "open"});
      });

      it("should dispatch connection state on error", () => {
        subject.requestOutput(dispatchMock, 1, 2);

        websocketMock.onerror();

        expect(dispatchMock).toBeCalledWith({type: "outputConnectionState", state: "error"});
      });

  });

});
