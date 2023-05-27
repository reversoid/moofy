import { styled } from '@nextui-org/react';
import ColorHash from 'color-hash';

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

export const ListBackground = ({
  id,
  imageUrl,
}: {
  id: string;
  imageUrl?: string;
}) => {
  if (imageUrl) {
    return <Background css={{ backgroundSize: 'cover', backgroundImage: `url(${imageUrl})` }} />;
  }
  return <Background css={{ bgColor: colorHash.hex(id) }} />;
};
