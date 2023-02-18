import { Modal, Text, Button, Loading } from '@nextui-org/react';
import React, { memo } from 'react';
import { decreasedPaddingMobileModal } from './styles';

interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  loading: boolean;
  onSubmit: () => void;
  submitText: string;
  content: React.ReactNode;
}

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  loading,
  onSubmit,
  submitText,
  content
}: ConfirmModalProps) => {
  return (
    <Modal
      closeButton
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width="45rem"
    >
      <Modal.Header>
        <Text h3>Подтверждение</Text>
      </Modal.Header>
      <Modal.Body css={decreasedPaddingMobileModal}>{content}</Modal.Body>
      <Modal.Footer css={decreasedPaddingMobileModal}>
        <Button
          size="lg"
          color={'gradient'}
          auto
          css={{ minWidth: '7.5rem', m: 0 }}
          onPress={onSubmit}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            submitText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ConfirmModal);
