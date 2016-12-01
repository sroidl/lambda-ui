/* globals describe it expect beforeEach afterEach */
import {FormattedDuration} from "DateAndTime.es6";
import {shallow} from "enzyme";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

const hours = int => int * 60 * 60;
const minutes = int => int * 60;

describe("Duration", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("long Duration", ()=> {
        const expectDuration = (input, expectedOutput) => {
            let inputProps = {seconds: input, longTime: true};

            let component = shallow(FormattedDuration(inputProps));

            expect(component.text()).toEqual(expectedOutput);
        };

        it("should display only seconds if less than one minute", ()=> {
            expectDuration(2, "2 seconds");
            expectDuration(59, "59 seconds");
        });
        it("should display minutes in mm:ss format if less than one hour", ()=> {
            expectDuration(60, "1 minute");
            expectDuration(61, "1 minute 1 second");
            expectDuration(630, "10 minutes 30 seconds");
            expectDuration(600, "10 minutes");
        });


        it("should display hours properly", ()=> {
            expectDuration(hours(1), "1 hour");
            expectDuration(hours(2) + minutes(35) + 45, "2 hours 35 minutes 45 seconds");
        });
    });

    describe("short Duration", () => {
        const expectDuration = (input, expectedOutput) => {
            let inputProps = {seconds: input, longTime: false};
            let component = shallow(FormattedDuration(inputProps));
            expect(component.text()).toEqual(expectedOutput);
        };

        it("should display only minutes and seconds if less than one houre", () => {
            expectDuration(2, "00:02");
            expectDuration(minutes(1)+43, "01:43");
            expectDuration(minutes(43)+23, "43:23");
        });

        it("should display hours if more than one houre", () => {
            expectDuration(hours(1), "01:00:00");
            expectDuration(hours(5) + minutes(23) + 57, "05:23:57");
            expectDuration(hours(23)+minutes(5), "23:05:00");
        });
    });
});