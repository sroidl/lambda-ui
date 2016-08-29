import {BuildSummary} from '../BuildSummary.es6';
import {shallow} from 'enzyme';


describe("BuildSummary", () =>{
  it("should show correct build state icon", ()=>{

    let inputProps = {buildId: 1, build: {}, toggleBuildDetails: undefined};

    let output = shallow(BuildSummary(inputProps));

    console.log(output)
  });
})
