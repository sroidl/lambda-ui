import {BuildDetails as subject} from '../BuildDetails.es6'
import {shallow} from 'enzyme'

describe("BuildDetails Component", ()=>{
  it("Should display loading message if no details are in state", ()=>{
    const input = {open: true, details: undefined}

    const component = shallow(subject(input));

    expect(component.text()).toEqual("Loading build details");
  })
})
