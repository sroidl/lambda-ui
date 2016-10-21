/* globals describe it jest expect beforeEach */
jest.mock("../main/WebSocketFactory.es6");
import {Backend} from "Backend.es6";
import {webSocket} from "WebSocketFactory.es6";

describe("Backend", () => {
    let subject;
    let dispatchMock;
    let websocketMock;

    const OPEN_STATE = 1;

    beforeEach(() => {
      subject = new Backend("baseUrl");
      dispatchMock = jest.fn();
      websocketMock = {close : jest.fn(), readystate: OPEN_STATE};
      webSocket.mockClear();
      webSocket.mockReturnValue(websocketMock);
    });

    it("should extract baseUrl", () => {
        expect(subject.baseUrl).toBe("baseUrl");
    });

    describe("outputConnection", () => {
      it("should request output", () => {
          subject.requestOutput(dispatchMock, 1, 2);

          expect(webSocket).toBeCalledWith("ws://baseUrl/lambdaui/api/builds/1/2");
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

    describe("buildDetails connection", () => {
      it("should request build details from backend", () => {
        subject.requestDetails(dispatchMock, 42);

        expect(webSocket).toBeCalledWith("ws://baseUrl/lambdaui/api/builds/42");
      });

      it("should close the build details conneciton if requested", () => {
        websocketMock.readystate = OPEN_STATE;

        subject.requestDetails(dispatchMock, 42);
        subject.closeDetailsConnection(42);

        expect(websocketMock.close).toBeCalled();
      });

      it("should dispatch incoming details update", () => {
        const body = {data : "{ \"incoming\": \"message\"}"};
        subject.requestDetails(dispatchMock, 1);

        websocketMock.onmessage(body);

        expect(dispatchMock).toBeCalledWith({type: "addBuildDetails", buildId: 1, buildDetails: {incoming: "message"}});
      });

      it("should handle multiple connections", () => {
        const websocket1 = {};
        const websocket2 = {};
        webSocket.mockReturnValue(websocket1);
        subject.requestDetails(dispatchMock, 1);
        webSocket.mockReturnValue(websocket2);
        subject.requestDetails(dispatchMock, 2);

        websocket1.onmessage({data : JSON.stringify(["hello"])});
        expect(dispatchMock).toBeCalledWith({type: "addBuildDetails", buildId: 1, buildDetails: ["hello"]});

        websocket2.onmessage({data: JSON.stringify(["world"])});
        expect(dispatchMock).toBeCalledWith({type: "addBuildDetails", buildId: 2, buildDetails: ["world"]});
      });

      it("should close multiple connections", () => {
        const websocket1 = {close: jest.fn()};
        const websocket2 = {close: jest.fn()};
        webSocket.mockReturnValue(websocket1);
        subject.requestDetails(dispatchMock, 1);
        webSocket.mockReturnValue(websocket2);
        subject.requestDetails(dispatchMock, 2);

        subject.closeDetailsConnection(1);
        subject.closeDetailsConnection(2);

        expect(websocket1.close).toBeCalled();
        expect(websocket2.close).toBeCalled();
      });

      it("should not open multiple connections for the same buildId", () => {
        subject.requestDetails(dispatchMock, 1);
        subject.requestDetails(dispatchMock, 1);

        expect(webSocket.mock.calls.length).toBe(1);
      });
    });

    describe("build summaries connection", () => {
      it("should request summaries endpoint", () => {
        subject.requestSummaries(dispatchMock);

        expect(webSocket).toBeCalledWith("ws://baseUrl/lambdaui/api/builds");
      });

      it("should dispatch incoming message to the store", () => {
        const jsonBody = JSON.stringify({summaries: {buildId: 1, status: "finished"}});
        subject.requestSummaries(dispatchMock);

        websocketMock.onmessage({data: jsonBody});

        expect(dispatchMock).toBeCalledWith({type: "addBuildSummaries", summaries: {buildId: 1, status: "finished"}});
      });

      it("should dispatch connection state of summaries connection", () => {
        subject.requestSummaries(dispatchMock);

        websocketMock.onclose();

        expect(dispatchMock).toBeCalledWith({type: "summariesConnectionState", state: "closed"});
      });
    });
  });

});
