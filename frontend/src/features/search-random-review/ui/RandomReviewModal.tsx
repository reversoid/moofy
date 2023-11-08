import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Loading, Text } from '@nextui-org/react';
import ConfettiExplosion from 'react-confetti-explosion';
import { ReviewItem } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';
import RefereshIcon from './refresh.icon';

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
