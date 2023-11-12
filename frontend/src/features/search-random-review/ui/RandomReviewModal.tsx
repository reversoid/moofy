import {
  Modal as _Modal,
  ModalBody as _ModalBody,
  ModalFooter,
  ModalHeader as _ModalHeader,
} from '@/shared/ui/Modal';
import { Button, Loading, styled, Text } from '@nextui-org/react';
import { ReviewFilm } from '@/entities/Review';
import { Review } from '@/shared/api/types/review.type';
import RefereshIcon from './refresh.icon';
import { useConfetti } from '../utils/useConfetti';
import { Confetti } from './Confetti';
import DescriptionCollapse from './DescriptionCollapse';

interface RandomReviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (newState: boolean) => void;
  review: Review;
  onPickRandom: () => void;
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
});

const Modal = styled(_Modal, {
  display: 'flex',
  alignItems: 'stretch',
});

const RandomReviewModal: React.FC<RandomReviewModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  review,
  onPickRandom,
  isLoading,
}) => {
  const { confettiArray, removeConfettiByKey, clearAllConfetti } = useConfetti(
    isLoading,
    isModalOpen,
  );

  const handleClose = () => {
    clearAllConfetti();
    setIsModalOpen(false);
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

          <ReviewFilm score={review.score} film={review.film} />
          <DescriptionCollapse description={review.description} />
        </>
      </ModalBody>
      <ModalFooter css={{ width: '100%', justifyContent: 'center' }}>
        <Button
          onPress={onPickRandom}
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
