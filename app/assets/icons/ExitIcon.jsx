import * as React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * @typedef {import('react-native-svg').SvgProps} SvgProps
 */

/**
 * @param {SvgProps} props
 */

const ExitIcon = (props) => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.25 3C0.25 1.48122 1.48122 0.25 3 0.25H9C10.5188 0.25 11.75 1.48122 11.75 3V6.11429H10.25V3C10.25 2.30964 9.69036 1.75 9 1.75H3C2.30964 1.75 1.75 2.30964 1.75 3V17C1.75 17.6904 2.30964 18.25 3 18.25H9C9.69036 18.25 10.25 17.6904 10.25 17V13.3714H11.75V17C11.75 18.5188 10.5188 19.75 9 19.75H3C1.48122 19.75 0.25 18.5188 0.25 17V3Z"
      fill="white"
    />
    <Path
      d="M5.25 10C5.25 9.58579 5.58579 9.25 6 9.25H16.6893L14.9697 7.53033C14.6768 7.23744 14.6768 6.76256 14.9697 6.46967C15.2626 6.17678 15.7374 6.17678 16.0303 6.46967L18.3232 8.76256C19.0066 9.44598 19.0066 10.554 18.3232 11.2374L16.0303 13.5303C15.7374 13.8232 15.2626 13.8232 14.9697 13.5303C14.6768 13.2374 14.6768 12.7626 14.9697 12.4697L16.6893 10.75H6C5.58579 10.75 5.25 10.4142 5.25 10Z"
      fill="white"
    />
  </Svg>
);
export default ExitIcon;
