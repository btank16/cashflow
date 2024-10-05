import * as React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * @typedef {import('react-native-svg').SvgProps} SvgProps
 */

/**
 * @param {SvgProps} props
 */

const InfoIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    viewBox="0 0 17 16"
    fill="none"
    {...props}
  >
    <Path
      d="M9.03038 4.46972C8.89465 4.33397 8.70713 4.25 8.5 4.25C8.08579 4.25 7.75 4.58579 7.75 5C7.75 5.41427 8.08583 5.7501 8.5001 5.7501C8.91431 5.7501 9.2501 5.41431 9.2501 5.0001C9.2501 4.79297 9.16613 4.60545 9.03038 4.46972Z"
      fill="#A4E1CF"
    />
    <Path
      d="M8.5 6.25C8.91421 6.25 9.25 6.58579 9.25 7V10C9.25 10.1381 9.36193 10.25 9.5 10.25C9.91421 10.25 10.25 10.5858 10.25 11C10.25 11.4142 9.91421 11.75 9.5 11.75C8.5335 11.75 7.75 10.9665 7.75 10V7C7.75 6.58579 8.08579 6.25 8.5 6.25Z"
      fill="#A4E1CF"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.5 8C15.5 11.866 12.366 15 8.5 15C4.63401 15 1.5 11.866 1.5 8C1.5 4.13401 4.63401 1 8.5 1C12.366 1 15.5 4.13401 15.5 8ZM14 8C14 11.0376 11.5376 13.5 8.5 13.5C5.46243 13.5 3 11.0376 3 8C3 4.96243 5.46243 2.5 8.5 2.5C11.5376 2.5 14 4.96243 14 8Z"
      fill="#A4E1CF"
    />
  </Svg>
);
export default InfoIcon;
