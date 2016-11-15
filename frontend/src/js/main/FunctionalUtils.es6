import * as R from "ramda";

const conmap = fn => (acc, child) => R.concat(acc, fn(child));
export const flatTree = stepDownFn =>
    input => {
        return stepDownFn(input) ? R.reduce(conmap(flatTree(stepDownFn)), [input], stepDownFn(input)) : [input];
    };

export const mapTree = mappingFn => input => {
    if (input.steps) {
        const mp = mapTree(mappingFn);
        return Object.assign({}, input, {steps: R.map(R.pipe(mp, mappingFn))(input.steps)});
    }
    return input;
};

const mapObject = (arg) => R.map(content => {
    if (content[arg] instanceof Array && content[arg].length > 0) {
        return R.append(content, mapObject(arg)(content[arg]));
    }
    return content;
});

export const getFlatTree = (object, arg) => {
    if(!object || !arg){return null;}
    const headArray = object[arg];

    return R.flatten(mapObject(arg)(headArray));
};

const getBuildDetails = R.view(R.lensProp("buildDetails"));
const getBuild = (buildId) => R.view(R.lensIndex(buildId));
const getBuildProps = buildId => R.pipe(getBuildDetails(), getBuild(buildId));

export const getFlatSteps = (state, buildId) => {
    const build = getBuildProps(buildId)(state);
    return getFlatTree(build, "steps");
};