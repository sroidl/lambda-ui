import * as R from "ramda";

const conmap = fn => (acc, child) => R.concat(acc, fn(child));
export const flatTree = stepDownFn =>
      input => { return stepDownFn(input) ? R.reduce(conmap(flatTree(stepDownFn)),[input], stepDownFn(input)) : [input]; };
