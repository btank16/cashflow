import * as React from "react";
import Svg, {
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

/**
 * @typedef {import('react-native-svg').SvgProps} SvgProps
 */

/**
 * @param {SvgProps} props
 */

const ExpenseLogo = (props) => (
  <Svg
    width={65}
    height={64}
    viewBox="0 0 65 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle
      cx={8}
      cy={37.5}
      r={6.5}
      fill="white"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Path
      d="M1.5 37V38.5C1.5 42.0899 4.41015 45 8 45C11.5899 45 14.5 42.0899 14.5 38.5V37"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Circle
      cx={60.5}
      cy={9}
      r={3}
      fill="white"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Circle
      cx={8}
      cy={37.5}
      r={4.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
      strokeDasharray="1 1"
    />
    <Rect
      x={17.25}
      y={8.75}
      width={36.5}
      height={47.5}
      rx={3.25}
      fill="white"
      stroke="#0E2C28"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Rect
      x={20}
      y={12.5}
      width={31}
      height={15}
      rx={1.5}
      fill="url(#paint0_linear_204_63224)"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.25 16.25V15H34.75V16.25H34.1364C32.8812 16.25 31.75 17.1973 31.75 18.5C31.75 19.8027 32.8812 20.75 34.1364 20.75H36.8636C37.4159 20.75 37.75 21.1459 37.75 21.5C37.75 21.8541 37.4159 22.25 36.8636 22.25L33.996 22.25C33.7409 22.25 33.5079 22.1565 33.3457 22.0078L33.0068 21.6971C32.7015 21.4172 32.227 21.4379 31.9471 21.7432C31.6672 22.0485 31.6879 22.523 31.9932 22.8029L32.3321 23.1135L32.8389 22.5607L32.3321 23.1135C32.7836 23.5274 33.3831 23.75 33.996 23.75H34.75V25H36.25V23.75H36.8636C38.1188 23.75 39.25 22.8027 39.25 21.5C39.25 20.1973 38.1188 19.25 36.8636 19.25H34.1364C33.5841 19.25 33.25 18.8541 33.25 18.5C33.25 18.1459 33.5841 17.75 34.1364 17.75H36.7671C37.0772 17.75 37.3243 17.9108 37.4325 18.1091C37.6308 18.4728 38.0864 18.6068 38.4501 18.4084C38.8137 18.2101 38.9477 17.7545 38.7493 17.3909C38.3561 16.6699 37.5782 16.25 36.7671 16.25H36.25Z"
      fill="#0E2C28"
    />
    <Rect
      x={20}
      y={31.5}
      width={9}
      height={9}
      rx={1.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Rect
      x={20}
      y={42.5}
      width={9}
      height={9}
      rx={1.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Rect
      x={31}
      y={31.5}
      width={9}
      height={9}
      rx={1.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Rect
      x={31}
      y={42.5}
      width={9}
      height={9}
      rx={1.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Rect
      x={42}
      y={31.5}
      width={9}
      height={20}
      rx={1.5}
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5 21.9506C21.5533 21.4489 25.5 17.1853 25.5 12C25.5 10.5778 25.2031 9.22492 24.6679 8H20.5C18.2909 8 16.5 9.79086 16.5 12V21.9506Z"
      fill="#0E2C28"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.5 45.0002V53.0001C54.5 55.2092 52.7091 57.0001 50.5 57.0001H44.7005C44.5693 56.3539 44.5005 55.6851 44.5005 55.0002C44.5005 49.4776 48.9774 45.0005 54.5 45.0002Z"
      fill="#0E2C28"
    />
    <Circle
      cx={14.5}
      cy={10}
      r={9}
      fill="white"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Circle
      cx={14.5}
      cy={10}
      r={7}
      fill="url(#paint1_linear_204_63224)"
      stroke="#0E2C28"
      strokeLinejoin="round"
    />
    <Circle cx={54.5} cy={54} r={10} fill="#0E2C28" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M55 51C55 50.7239 54.7761 50.5 54.5 50.5C54.2239 50.5 54 50.7239 54 51V53.5H51.5C51.2239 53.5 51 53.7239 51 54C51 54.2761 51.2239 54.5 51.5 54.5H54V57C54 57.2761 54.2239 57.5 54.5 57.5C54.7761 57.5 55 57.2761 55 57V54.5H57.5C57.7761 54.5 58 54.2761 58 54C58 53.7239 57.7761 53.5 57.5 53.5H55V51Z"
      fill="white"
    />
    <Path d="M14.5 8L16.5 10L14.5 12L12.5 10L14.5 8Z" stroke="#0E2C28" />
    <Defs>
      <LinearGradient
        id="paint0_linear_204_63224"
        x1={35.5}
        y1={12}
        x2={35.5}
        y2={28}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#109C50" />
        <Stop offset={1} stopColor="#109C50" stopOpacity={0} />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_204_63224"
        x1={14.5}
        y1={3}
        x2={14.5}
        y2={17}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#109C50" />
        <Stop offset={1} stopColor="#109C50" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default ExpenseLogo;
