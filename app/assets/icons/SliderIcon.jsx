import * as React from "react";
import Svg, { Circle } from "react-native-svg";

/**
 * @typedef {import('react-native-svg').SvgProps} SvgProps
 */

/**
 * @param {SvgProps} props
 */

const SliderIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Circle
      cx={12}
      cy={12}
      r={11}
      fill="#121615"
      stroke="white"
      strokeWidth={2}
    />
    <Circle cx={12} cy={12} r={4} fill="white" />
  </Svg>
);
export default SliderIcon;