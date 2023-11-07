import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Text } from '@nextui-org/react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useEffect, useState } from 'react';
import { ReviewItem } from '@/entities/Review';
import { useControllRandomReview } from '../utils/useControllSearch';
import RandomDropDown from './RandomDropdown';
import { Critarea } from '../api';
import FakeReview from './FakeReview';
import { NoReviewsAlert } from './NoReviewsAlert';

interface RandomReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
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
}) => {
  const [type, setType] = useState<Critarea>('');
  const { review, isLoading, refetch, setIsExploded } =
    useControllRandomReview(type);

  const hasReview = review && review[0];

  const handleClose = () => {
    setIsOpen(false);
    setIsExploded(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <Modal
      scroll={false}
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={handleClose}
      css={{
        minHeight: '30rem',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <ModalHeader css={ModalHeaderCss}>
        <Text h3>Найти случайный обзор</Text>
      </ModalHeader>
      <ModalBody css={ModalBodyCss}>
        {!isLoading && hasReview && (
          <>
            <ConfettiExplosion
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
              }}
              {...ConfettiConfig}
            />
            <ReviewItem review={review[0]} horizontal={false} />
            <Text
              css={{
                textAlign: 'center',
                wordBreak: 'break-word',
                width: '100%',
              }}
            >
              {review[0].description}
            </Text>
          </>
        )}
        {isLoading || (!hasReview && <FakeReview />)}
      </ModalBody>
      <ModalFooter css={{ width: '100%', justifyContent: 'center' }}>
        <RandomDropDown
          handleSearch={refetch}
          setType={setType}
          isLoading={isLoading}
        />
        <NoReviewsAlert review={review} refetch={refetch} />
      </ModalFooter>
    </Modal>
  );
};

export default RandomReviewModal;
