import { styled } from "@nextui-org/react";
import ColorHash from "color-hash";

const colorHash = new ColorHash();

export const Background = styled('div', {
  height: 140,
  backgroundSize: '5rem',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  '@xsMax': {
    height: 105,
    backgroundSize: '4rem',
  },
});

export const ListBackground = ({ strToHash }: { strToHash: string }) => {
  return <Background css={{ bgColor: colorHash.hex(strToHash) }} />;
};
