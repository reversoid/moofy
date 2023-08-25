import { Modal, ModalHeader } from '@/shared/ui/Modal';
import { Text } from '@nextui-org/react';
import { memo, useEffect } from 'react';
import { ReviewForm } from './ReviewForm';

export interface ReviewFormData {
  description: string;
  score: number | null;
}

export interface ReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  form?: ReviewFormData;

  state: {
    loading: boolean;
    success: boolean;
  };
  handlers: {
    onSubmit: (data: ReviewFormData) => any;
    onSuccess: () => void;
  };
}

/** Provides basis for update and create review modal */
const ReviewModal = ({
  isOpen,
  setIsOpen,
  form,
  handlers,
  state,
}: ReviewModalProps) => {
  useEffect(() => {
    if (!state.success) {
      return;
    }
    handlers.onSuccess();
  }, [state.success]);

  return (
    <>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader css={{ paddingBottom: '$3' }}>
          <Text h3>Обзор к фильму</Text>
        </ModalHeader>

        <ReviewForm
          form={form}
          onSubmit={handlers.onSubmit}
          loading={state.loading}
        />
      </Modal>
    </>
  );
};

export default memo(ReviewModal);
