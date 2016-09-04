import {BuildDetails as subject} from '../BuildDetails.es6'
import {shallow} from 'enzyme'



describe("BuildDetails Component", ()=>{

  const input = newAttributes => Object.assign({buildId: 1, open: true, details: undefined, requestDetailsFn: jest.fn()}, newAttributes)

  it("Should display loading message if no details are in state", ()=>{
    const component = shallow(subject(input()));

    expect(component.text()).toEqual("Loading build details");
  });

  it("Should request build details if no details are in the state", ()=> {
    const requestMockFn = jest.fn();

    shallow(subject(input({requestDetailsFn: requestMockFn})));

    expect(requestMockFn).toBeCalled();
  })
})
