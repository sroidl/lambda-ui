import R from "ramda";

export const classes = (...classes) => {
    return R.pipe(R.reject(R.isNil), R.join(" "))(classes).trim();
};

export default {classes};
