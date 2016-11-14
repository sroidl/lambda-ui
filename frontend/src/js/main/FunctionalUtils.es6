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

const getBuildDetails = R.view(R.lensProp("buildDetails"));
const getBuild = (buildId) => R.view(R.lensIndex(buildId));
const getBuildProps = buildId => R.pipe(getBuildDetails(), getBuild(buildId));

export const getFlatTree = (object, arg) => {
    if(!object || !arg){return null;}
    const headArray = object[arg];
    const flatTree = [];
    const extractElements = (array, arg, flatTree) => {
        R.map(content => {
            flatTree.push(content);
            if (content[arg] instanceof Array && content[arg].length > 0) {
                extractElements(content[arg], arg, flatTree);
            }
        })(array);
    };
    extractElements(headArray, arg, flatTree);
    return flatTree;
};

export const getFlatSteps = (state, buildId) => {
    const build = getBuildProps(buildId)(state);
    return getFlatTree(build, "steps");
};