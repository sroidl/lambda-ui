import ReduxBuildSummary, {BuildSummary} from '../BuildSummary.es6';
import * as subject from '../BuildSummary.es6'
import {shallow} from 'enzyme';
import {now} from 'moment';

function buildIcon(domElement){
  return domElement.find('.buildIcon').find('.fa');
}

function domDuration(domElement){
  return domElement.find('.buildDuration');
}

describe("BuildSummary Display", ()=>{
  describe("BuildIcons", () =>{
  it("should show correct failed state icon", ()=>{
    let inputProps = {buildId: 1, state: 'failed', startTime: {toISOString: jest.fn()}, toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-times')).toBe(true);
  });

  it("should show correct success state icon", ()=>{
    let inputProps = {buildId: 1, state: 'success', toggleBuildDetails: undefined, startTime: {toISOString: jest.fn()}};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-check')).toBe(true);
  });

  it("should show correct running state icon", ()=>{
    let inputProps = {buildId: 1, state: 'running', toggleBuildDetails: undefined, startTime: {toISOString: jest.fn()}};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-cog')).toBe(true);
  });
});
  describe("Duration", ()=>{
      const defaultProps = newAttributes =>
      Object.assign({buildId:1, state:'running', toggleBuildDetails: undefined, startTime: now()}, newAttributes)

      const expectDuration = (input, expectedOutput) => {
        let inputProps = defaultProps({duration: input})

        let component = shallow(BuildSummary(inputProps));

        let duration = str => "Duration: " + str;
        expect(domDuration(component).text()).toEqual(duration(expectedOutput))
      }

      it("should display only seconds if less than one minute", ()=>{
        expectDuration(2, "2 seconds");
        expectDuration(59,"59 seconds");
      })
      it("should display minutes in mm:ss format if less than one hour", ()=>{
        expectDuration(60, "1 minute")
        expectDuration(61, "1 minute 1 second");
        expectDuration(630, "10 minutes 30 seconds")
        expectDuration(600, "10 minutes");
      })

      const hours = int => int * 60 * 60;
      const minutes = int => int * 60;
      it("should display hours properly", ()=>{
        expectDuration(hours(1), "1 hour")
        expectDuration(hours(2)+ minutes(35) + 45, "2 hours 35 minutes 45 seconds")
      })
  })
})
describe("BuildSummary Toggle", ()=>{
  it("should call the toggle details function on click", ()=>{
    let toggleFnMock = jest.fn();
    let inputProps = {buildId: 1, toggleBuildDetails: toggleFnMock, startTime: {toISOString: jest.fn()}};

    let component = shallow(BuildSummary(inputProps));
    component.find(".buildDetailsToggle").simulate('click');

    expect(toggleFnMock).toBeCalled();
  })
});

describe("BuildSummary redux mapping", ()=>{
  it("should map to props properly", ()=>{
    let state = {summaries: {1: {buildId: 1, buildNumber: 12, state:"running", duration:"10min", startTime:"12sec"}}}

    let props = subject.mapStateToProps(state, {build: {buildId: 1, buildNumber: 12, state:"success", duration:"10min", startTime:"12sec"}});

    expect(props).toEqual({
      buildId: 1,
      buildNumber: 12,
      state: "success",
      duration: "10min",
      startTime: "12sec"
    });

  })
})
