import { Button, Loading, styled } from '@nextui-org/react';
import { Shuffle } from '@/shared/Icons/Shuffle.icon';

interface RandomReviewBtnProps {
  pickRandom: () => void;
  isLoading: boolean;
}

const Btn = styled(Button, {
  px: '0 !important',
  minWidth: '4.25rem !important',
});

const RandomReviewBtn: React.FC<RandomReviewBtnProps> = ({
  pickRandom,
  isLoading,
}) => {
  return (
    <Btn
      onPress={() => {
        pickRandom();
      }}
      color="secondary"
      aria-label="Random review"
    >
      {isLoading ? (
        <Loading size="sm" color={'white'} />
      ) : (
        <Shuffle width="1.75rem" height="1.75rem" />
      )}
    </Btn>
  );
};

export default RandomReviewBtn;
