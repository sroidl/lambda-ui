/* globals describe it expect beforeEach jest */
jest.mock("../main/Utils.es6");
import * as subject from "../main/Polling.es6";
import * as UtilsMock from "../main/Utils.es6";

const createStore = (state) => {
    return {getState: () => state, dispatch: jest.fn()};
};

describe("Polling", () => {

    let backend;

    beforeEach(() => {
        backend = { requestDetails: jest.fn()};

        UtilsMock.delay.mockReturnValue({then: jest.fn()});
    });

    it("should call requestDetails", () => {
        const store = createStore({openedBuilds : {1: true, 2: false, 3: true}});

        subject.buildDetailsPolling(backend, store);

        expect(backend.requestDetails).toHaveBeenCalledWith(store.dispatch, "1");
        expect(backend.requestDetails).not.toHaveBeenCalledWith(store.dispatch, "2");
        expect(backend.requestDetails).toHaveBeenCalledWith(store.dispatch, "3");

        expect(UtilsMock.delay().then).toHaveBeenCalled();
    });

    it("should loop after 1 second", () => {
        const store = createStore({openedBuilds : {1: true, 2: false, 3: true}});

        const thenFn = UtilsMock.delay().then;
        thenFn.mockImplementationOnce(cb => cb());

        subject.buildDetailsPolling(backend, store);

        expect(thenFn).toHaveBeenCalledTimes(2);
        expect(UtilsMock.delay).toHaveBeenCalledWith(1000);
    });

});