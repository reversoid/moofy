import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Loading, Text } from '@nextui-org/react';
import { ReviewItem } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';
import RefereshIcon from './refresh.icon';
import { useConfetti } from '../utils/useConfetti';
import { Confetti } from './Confetti';

interface RandomReviewModalProps {
  isModalOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  review: Review;
  pickRandom: () => void;
  isLoading: boolean;
}

const ModalHeaderCss = {
  paddingBottom: '$3',
  display: 'flex',
  flexDirection: 'column',
};

const ModalBodyCss = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .nextui-c-iLyjkd': {
    overflow: 'visible !important',
    border: 'none !important',
  },
};

const RandomReviewModal: React.FC<RandomReviewModalProps> = ({
  isModalOpen,
  setIsOpen,
  review,
  pickRandom,
  isLoading,
}) => {
  const { confettiArray, removeConfettiByKey, clearAllConfetti } = useConfetti(
    isLoading,
    isModalOpen,
  );

  const handleClose = () => {
    clearAllConfetti();
    setIsOpen(false);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      open={isModalOpen}
      onClose={handleClose}
      width="20rem"
      css={{
        display: 'flex',
        alignItems: 'stretch',
        '@xsMax': {
          width: '100% !important',
        },
      }}
    >
      <ModalHeader css={ModalHeaderCss}>
        <Text h3>Случайный обзор</Text>
      </ModalHeader>
      <ModalBody css={ModalBodyCss}>
        <>
          <Confetti
            confettiArray={confettiArray}
            onComplete={removeConfettiByKey}
          />

          <ReviewItem review={review} horizontal={false} />
          <Text
            css={{
              textAlign: 'center',
              wordBreak: 'break-word',
              width: '100%',
            }}
          >
            {review.description}
          </Text>
        </>
      </ModalBody>
      <ModalFooter css={{ width: '100%', justifyContent: 'center' }}>
        <Button
          onPress={pickRandom}
          color={'gradient'}
          disabled={isLoading}
          auto
          css={{ width: '100%' }}
          size={'lg'}
        >
          {isLoading ? (
            <Loading color={'white'} type="points" size="lg" />
          ) : (
            <RefereshIcon />
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RandomReviewModal;
