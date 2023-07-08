import ConfirmModal from '@/shared/ui/ConfirmModal';
import { FC, memo, useEffect } from 'react';
import DeleteModalContent from './DeleteListModalContent';
import { useNavigate } from 'react-router-dom';
import { useDeleteList } from '../lib/useDeleteList';

export interface DeleteListModalProps {
  listId: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (newValue: boolean) => void;
}

export const DeleteListModal: FC<DeleteListModalProps> = memo(
  ({ isDialogOpen, listId, setIsDialogOpen }) => {
    const mutation = useDeleteList();
    const navigate = useNavigate();

    useEffect(() => {
      if (!mutation.isSuccess) {
        return;
      }
      setIsDialogOpen(false);
      navigate('/welcome');
    }, [mutation.isSuccess]);

    return (
      <ConfirmModal
        content={<DeleteModalContent />}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        loading={mutation.isLoading}
        submitText="Удалить"
        onSubmit={() => mutation.mutate({ listId })}
        buttonColor="error"
      />
    );
  },
);
