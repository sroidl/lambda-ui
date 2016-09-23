/* globals describe it jest expect */
jest.mock("../WebSocketFactory.es6");
import * as subject from "../Backend.es6";
import {webSocket} from "../WebSocketFactory.es6";


describe("Backend: output connection", () => {
    it("should close websocket if output view changes", () => {
        const webSocketMock = {readystate: 3, close: jest.fn()};
        webSocket.mockReturnValue(webSocketMock);
        const requestOutput = subject.outputConnection.requestOutput(jest.fn(), "url");

        requestOutput(1,1);
        requestOutput(1, 2);

        expect(webSocketMock.close).toBeCalled();
    });
});
