import {
  Modal as _Modal,
  ModalBody as _ModalBody,
  ModalFooter,
  ModalHeader as _ModalHeader,
} from '@/shared/ui/Modal';
import { Button, Loading, styled, Text } from '@nextui-org/react';
import { ReviewItem } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';
import RefereshIcon from './refresh.icon';
import { useConfetti } from '../utils/useConfetti';
import { Confetti } from './Confetti';
import DescriptionCollapse from './DescriptionCollapse';

interface RandomReviewModalProps {
  isModalOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  review: Review;
  pickRandom: () => void;
  isLoading: boolean;
}

const ModalHeader = styled(_ModalHeader, {
  paddingBottom: '$3',
  display: 'flex',
  flexDirection: 'column',
});

const ModalBody = styled(_ModalBody, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .nextui-c-iLyjkd': {
    overflow: 'visible !important',
    border: 'none !important',
  },
});

const Modal = styled(_Modal, {
  display: 'flex',
  alignItems: 'stretch',
  '@xsMax': {
    width: '100% !important',
  },
});

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
    >
      <ModalHeader>
        <Text h3>Случайный обзор</Text>
      </ModalHeader>
      <ModalBody>
        <>
          <Confetti
            confettiArray={confettiArray}
            onComplete={removeConfettiByKey}
          />

          <ReviewItem review={review} horizontal={false} />
          <DescriptionCollapse description={review.description} />
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
            <Loading color="white" type="points" size="lg" />
          ) : (
            <RefereshIcon />
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RandomReviewModal;
