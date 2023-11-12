import { SVGProps } from 'react';

const RefereshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? '1.75rem'}
    height={props.height ?? '1.75rem'}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#ecedee"
      fillRule="evenodd"
      d="M2.06 10.893C2.596 5.91 6.73 2 11.786 2c2.86 0 5.428 1.253 7.213 3.24V4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h1.867c-1.432-1.835-3.627-3-6.08-3-3.987 0-7.306 3.09-7.74 7.107a1 1 0 1 1-1.988-.214Zm18.994 1.113a1 1 0 0 1 .887 1.101C21.403 18.09 17.27 22 12.213 22 9.353 22 6.785 20.747 5 18.76V20a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6.133c1.432 1.835 3.627 3 6.08 3 3.988 0 7.306-3.09 7.74-7.107a1 1 0 0 1 1.1-.887Z"
      clipRule="evenodd"
    />
  </svg>
);

export default RefereshIcon;
