import {BuildSummary} from '../BuildSummary.es6';
import {shallow} from 'enzyme';

function buildIcon(domElement){
  return domElement.find('.buildIcon').find('.fa');
}

describe("BuildSummary", () =>{
  it("should show correct failed state icon", ()=>{
    let inputProps = {buildId: 1, build: {state: 'failed'}, toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-times')).toBe(true);
  });

  it("should show correct success state icon", ()=>{
    let inputProps = {buildId: 1, build: {state: 'success'}, toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-check')).toBe(true);
  });

  it("should show correct running state icon", ()=>{
    let inputProps = {buildId: 1, build: {state: 'running'}, toggleBuildDetails: undefined};

    let component = shallow(BuildSummary(inputProps));

    expect(buildIcon(component).hasClass('fa-cog')).toBe(true);
  });
})
