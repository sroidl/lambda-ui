import * as R from "ramda";

const conmap = fn => (acc, child) => R.concat(acc, fn(child));
export const flatTree = stepDownFn =>
      input => { return stepDownFn(input) ? R.reduce(conmap(flatTree(stepDownFn)),[input], stepDownFn(input)) : [input]; };

/* eslint-disable */

export const mapTree = mappingFn => input =>{
  if (input.steps) {
    const mp = mapTree(mappingFn);
    return Object.assign({}, input, {steps:  R.map(R.pipe(mp, mappingFn))(input.steps)});
  }
  return input;
}
