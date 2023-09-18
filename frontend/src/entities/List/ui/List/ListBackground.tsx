import { colorHash } from '@/shared/utils/colorHash';
import { styled } from '@nextui-org/react';


export const Background = styled('div', {
  height: 140,
  backgroundSize: '5rem',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  '@smMax': {
    height: 120,
  },
  '@xsMax': {
    height: 90,
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
    return (
      <Background
        css={{ backgroundSize: 'cover', backgroundImage: `url(${imageUrl})` }}
      />
    );
  }
  return <Background css={{ bgColor: colorHash.hex(id) }} />;
};
