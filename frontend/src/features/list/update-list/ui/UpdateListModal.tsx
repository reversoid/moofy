import { Modal, ModalHeader } from '@/shared/ui/Modal';
import { Text } from '@nextui-org/react';
import { memo } from 'react';
import { UpdateListModalForm } from './UpdateListModalForm';

export interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface UpdateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  listData: FormData;
  listId: number;
  listImageUrl?: string;
}

export const UpdateListModal = memo(
  ({
    isOpen,
    setIsOpen,
    listData,
    listId,
    listImageUrl,
  }: UpdateListModalProps) => {
    const handleClose = () => {
      setIsOpen(false);
    };

    return (
      <>
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <ModalHeader>
            <Text h3>Изменить коллекцию</Text>
          </ModalHeader>
          <UpdateListModalForm
            initialValues={listData}
            listId={listId}
            listImageUrl={listImageUrl}
            onClose={handleClose}
          />
        </Modal>
      </>
    );
  },
  (prev, next) => {
    const formEqual =
      (prev.listData.description === next.listData.description &&
        prev.listData.isPrivate === next.listData.isPrivate) ??
      prev.listData.name === next.listData.name;
    return (
      formEqual && prev.isOpen === next.isOpen && prev.listId === next.listId
    );
  },
);
