/* eslint-disable */
/* globals describe it jest expect */
jest.mock("../WebSocketFactory.es6");
import {Backend} from "../BackendNew.es6";
import {webSocket} from "../WebSocketFactory.es6";

const _it = () => {};

describe("Backend: output connection", () => {
    _it("should close websocket if output view changes", () => {
        const webSocketMock = {readystate: 3, close: jest.fn()};
        webSocket.mockReturnValue(webSocketMock);
        const requestOutput = subject.outputConnection.requestOutput(jest.fn(), "url");

        requestOutput(1, 1);
        requestOutput(1, 2);

        expect(webSocketMock.close).toBeCalled();
    });
});


describe("New Backend: Configuration", () => {
    it("should extract baseUrl", () => {
        const subject = new Backend({baseUrl: "baseUrl"});

        expect(subject.baseUrl).toBe("baseUrl");
    });
});

