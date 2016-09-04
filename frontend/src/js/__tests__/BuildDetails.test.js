jest.mock("../Backend.es6");
import BuildDetailsRedux, {BuildDetails as subject} from '../BuildDetails.es6'
import {shallow, mount} from 'enzyme'
import {requestBuildDetails as requestBuildDetailsMock} from '../Backend.es6'
import {MockStore} from './TestSupport.es6'
import React from 'react';
import { Provider } from 'react-redux'



describe("BuildDetails Component", ()=>{

  const _it = () => {}

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

  it("should render all buildSteps on first level", ()=>{
    let steps = [{stepId: 1}, {stepId: 2}]

    let component = shallow(subject(input({details: {steps: steps}})));

    expect(component.find("BuildStep").length).toEqual(2)
  })

  it("MapDispatchToProps should wire to backend.", ()=>{
    let store = MockStore({buildDetails: {}, openedBuilds: {2: true}});

    let provider = mount(<BuildDetailsRedux store={store} buildId="2"/>);
    provider.html();

    expect(requestBuildDetailsMock).toBeCalled();
  })
})
