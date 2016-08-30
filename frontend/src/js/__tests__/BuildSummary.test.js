import ReduxBuildSummary, {BuildSummary} from '../BuildSummary.es6';
import * as subject from '../BuildSummary.es6'
import {shallow} from 'enzyme';

function buildIcon(domElement){
  return domElement.find('.buildIcon').find('.fa');
}



describe("BuildSummary BuildIcons", () =>{
  it("should show correct failed state icon", ()=>{
    let inputProps = {buildId: 1, state: 'failed', toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-times')).toBe(true);
  });

  it("should show correct success state icon", ()=>{
    let inputProps = {buildId: 1, state: 'success', toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-check')).toBe(true);
  });

  it("should show correct running state icon", ()=>{
    let inputProps = {buildId: 1, state: 'running', toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-cog')).toBe(true);
  });
});

describe("BuildSummary Toggle", ()=>{
  it("should call the toggle details function on click", ()=>{
    let toggleFnMock = jest.fn();
    let inputProps = {buildId: 1, toggleBuildDetails: toggleFnMock};

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
