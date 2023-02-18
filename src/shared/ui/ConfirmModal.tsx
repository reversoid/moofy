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
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ConfirmModal);
