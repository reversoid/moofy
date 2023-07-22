import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Loading, Text } from '@nextui-org/react';
import { memo, useEffect } from 'react';
import { useUploadImage } from '../../update-list/lib/useUploadImage';
import { useCreateListModal } from '../utils/useCreateListModal';
import { CreateListForm } from './CreateListForm';

interface CreateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

export const CreateListModal = memo(
  ({ isOpen, setIsOpen }: CreateListModalProps) => {
    const createListMutation = useCreateListModal();
    const uploadListImageMutation = useUploadImage();

    const handleClose = () => {
      createListMutation.reset();
      uploadListImageMutation.reset();
      setIsOpen(false);
    };

    useEffect(() => {
      if (!createListMutation.isSuccess) {
        return;
      }
      handleClose();
    }, [createListMutation.isSuccess]);

    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader>
          <Text h3>Создать коллекцию</Text>
        </ModalHeader>
        <CreateListForm onSuccess={handleClose} />
      </Modal>
    );
  },
);
