import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Text } from '@nextui-org/react';
import ConfettiExplosion from 'react-confetti-explosion';
import { ReviewItem } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';

interface RandomReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  review: Review;
  pickRandom: () => void;
  isLoading: boolean;
  exploded: boolean;
}

const ConfettiConfig = {
  zIndex: 10000,
  force: 1,
  duration: 3000,
  particleCount: 150,
  width: 800,
  height: 800,
};

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
  isOpen,
  setIsOpen,
  review,
  pickRandom,
  isLoading,
  exploded,
}) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      css={{
        minHeight: '30rem',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <ModalHeader css={ModalHeaderCss}>
        <Text h3>Случайный обзор</Text>
      </ModalHeader>
      <ModalBody css={ModalBodyCss}>
        <>
          {!isLoading && exploded && (
            <ConfettiExplosion
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
              }}
              {...ConfettiConfig}
            />
          )}

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
          onPress={() => {
            pickRandom();
          }}
          color={'gradient'}
          size={'lg'}
        >
          Повторить
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RandomReviewModal;
