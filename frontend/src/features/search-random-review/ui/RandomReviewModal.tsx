import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Loading, Text } from '@nextui-org/react';
import ConfettiExplosion from 'react-confetti-explosion';
import { ReviewItem } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';
import RefereshIcon from './refresh.icon';
import { useState, useEffect, useCallback } from 'react';
import { useConfetti } from '../utils/useConfetti';

interface RandomReviewModalProps {
  isModalOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  review: Review;
  pickRandom: () => void;
  isLoading: boolean;
}

const ConfettiConfig = {
  zIndex: 10000,
  force: 1,
  duration: 2000,
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
  isModalOpen,
  setIsOpen,
  review,
  pickRandom,
  isLoading,
}) => {
  const { confettiArray, setConfettiArray } = useConfetti(
    isLoading,
    isModalOpen,
  );

  const handleClose = () => {
    setConfettiArray(() => []);
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
          {confettiArray.map((key) => (
            <ConfettiExplosion
              key={key}
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
              }}
              onComplete={() => setConfettiArray([])}
              {...ConfettiConfig}
            />
          ))}

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
