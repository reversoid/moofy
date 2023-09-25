import { Button, CSS, Loading, styled } from '@nextui-org/react';
import { FC } from 'react';
import { getTextColorForBackground } from '../utils/getTextColorForBackground/getTextColorForBackground';

const LoadMoreContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: '$10',
  '@xsMax': {
    mt: '$8',
  },
});

export interface LoadMoreProps {
  loadMore?: () => void;
  loading?: boolean;
  button?: {
    text?: string;
    color?: string;
    style?: 'primary' | 'gradient';
    noMargin?: boolean;
    mb?: boolean;
  };
}

const LoadMore: FC<LoadMoreProps> = ({ loadMore, loading, button }) => {
  const buttonStyles: CSS = {
    '@xsMax': { width: '100%' },
    background: button?.color,
    color: button?.color
      ? getTextColorForBackground(button.color, '$text', '$textLight')
      : undefined,
  };
  return (
    <LoadMoreContainer
      css={{
        mt: button?.noMargin ? 0 : undefined,
        mb: button?.mb ? '$5' : undefined,
      }}
    >
      <Button
        css={buttonStyles}
        color={button?.style}
        onClick={() => loadMore && loadMore()}
      >
        {loading ? (
          <Loading type="points" color="white" />
        ) : (
          <>{button?.text ?? 'Загрузить больше'}</>
        )}
      </Button>
    </LoadMoreContainer>
  );
};

export default LoadMore;
