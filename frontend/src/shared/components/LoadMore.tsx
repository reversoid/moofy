import { Button, Loading, styled } from '@nextui-org/react';
import { FC } from 'react';

const LoadMoreContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: '$8',
});

export interface LoadMoreProps {
  loadMore?: () => void;
  loading?: boolean;
  buttonText?: string;
}

const LoadMore: FC<LoadMoreProps> = ({ loadMore, loading, buttonText }) => {
  return (
    <LoadMoreContainer>
      <Button color={'gradient'} onClick={() => loadMore && loadMore()}>
        {loading ? (
          <Loading type="points" color="white" />
        ) : (
          <>{buttonText ?? 'Загрузить больше'}</>
        )}
      </Button>
    </LoadMoreContainer>
  );
};

export default LoadMore;
