import * as React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * @typedef {import('react-native-svg').SvgProps} SvgProps
 */

/**
 * @param {SvgProps} props
 */

const CalculatorIcon = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16 19.25C15.5858 19.25 15.25 18.9142 15.25 18.5L15.25 17.25H14C13.5858 17.25 13.25 16.9142 13.25 16.5C13.25 16.0858 13.5858 15.75 14 15.75H15.25V14.5C15.25 14.0858 15.5858 13.75 16 13.75C16.4142 13.75 16.75 14.0858 16.75 14.5V15.75H18C18.4142 15.75 18.75 16.0858 18.75 16.5C18.75 16.9142 18.4142 17.25 18 17.25H16.75V18.5C16.75 18.9142 16.4142 19.25 16 19.25Z"
      fill="white"
    />
    <Path
      d="M10.75 16.5C10.75 16.9142 10.4142 17.25 10 17.25H6C5.58579 17.25 5.25 16.9142 5.25 16.5C5.25 16.0858 5.58579 15.75 6 15.75H10C10.4142 15.75 10.75 16.0858 10.75 16.5Z"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.25 4.25V10.75H19.75V4.25H4.25ZM5.75 9.25V5.75H18.25V9.25H5.75Z"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25 4C1.25 2.48122 2.48122 1.25 4 1.25H20C21.5188 1.25 22.75 2.48122 22.75 4V20C22.75 21.5188 21.5188 22.75 20 22.75H4C2.48122 22.75 1.25 21.5188 1.25 20V4ZM4 2.75C3.30964 2.75 2.75 3.30964 2.75 4V20C2.75 20.6904 3.30964 21.25 4 21.25H20C20.6904 21.25 21.25 20.6904 21.25 20V4C21.25 3.30964 20.6904 2.75 20 2.75H4Z"
      fill="white"
    />
  </Svg>
);
export default CalculatorIcon;
