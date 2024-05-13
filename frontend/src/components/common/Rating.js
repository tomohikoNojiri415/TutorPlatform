import React from "react";
import { Rate } from "antd";

const roundToNearestHalf = (value) => {
  return Math.round(value * 2) / 2;
};
const RateView = ({ value }) => (
  <Rate allowHalf disabled defaultValue={roundToNearestHalf(value)} />
);
export default RateView;
