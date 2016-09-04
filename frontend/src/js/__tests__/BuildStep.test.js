import React from 'react';
import {shallow} from 'enzyme';
import {BuildStep} from '../BuildStep.es6'


describe("BuildStep rendering", ()=>{

  const details = newAttributes => Object.assign({stepId: 1, state: 'success', name: 'fooStep'}, newAttributes)

  it("should render all step information", ()=>{
    let input = details();

    let component = shallow(<BuildStep buildId={1} step={input}/>);

    expect(component.find('.stepName').text()).toEqual('fooStep');
    expect(component.find('.buildStep').hasClass('success')).toBe(true);
  });

  it("should render failed step state", ()=>{
    let component = shallow(<BuildStep buildId={1} step={details({state: "failed"})}/>);
    expect(component.find('.buildStep').hasClass('failed')).toBe(true);
  });

  it("should render running step state", ()=>{
    let component = shallow(<BuildStep buildId={1} step={details({state: "running"})}/>);
    expect(component.find('.buildStep').hasClass('running')).toBe(true);
  });

  it("should render pending step state", ()=>{
    let component = shallow(<BuildStep buildId={1} step={details({state: "pending"})}/>);
    expect(component.find('.buildStep').hasClass('pending')).toBe(true);
  });

})
