import R from "ramda";

export const classes = (...classes) => {
  return R.reduce((acc, val) => acc + " " + val, "")(classes).trim();
};

export default {classes};
