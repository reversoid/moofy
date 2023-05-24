import { Text, Button, Loading } from '@nextui-org/react';
import React, { memo } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  loading: boolean;
  onSubmit: () => void;
  submitText: string;
  content: React.ReactNode;
  buttonColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'gradient';
}

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  loading,
  onSubmit,
  submitText,
  content,
  buttonColor,
}: ConfirmModalProps) => {
  return (
    <Modal closeButton open={isOpen} onClose={() => setIsOpen(false)}>
      <ModalHeader>
        <Text h3>Подтверждение</Text>
      </ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button
          size="md"
          color={buttonColor}
          auto
          css={{
            minWidth: '7.5rem',
            m: 0,
            '@xsMax': {
              width: '100%',
            },
          }}
          onPress={onSubmit}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            submitText
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default memo(ConfirmModal);
