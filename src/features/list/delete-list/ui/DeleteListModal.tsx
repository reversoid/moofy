import ConfirmModal from '@/shared/ui/ConfirmModal';
import { FC, memo, useEffect } from 'react';
import DeleteModalContent from './DeleteListModalContent';
import { $deleteListState, clearState, deleteList } from '../model';
import { useStore } from 'effector-react';
import { useNavigate } from 'react-router-dom';

export interface DeleteListModalProps {
  listId: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (newValue: boolean) => void;
}

export const DeleteListModal: FC<DeleteListModalProps> = memo(
  ({ isDialogOpen, listId, setIsDialogOpen }) => {
    const { loading, success } = useStore($deleteListState);
    const navigate = useNavigate();

    useEffect(() => {
      if (!success) {
        return;
      }
      clearState();
      setIsDialogOpen(false);
      navigate('/welcome');
    }, [success]);

    return (
      <ConfirmModal
        content={<DeleteModalContent />}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        loading={loading}
        submitText="Удалить"
        onSubmit={() => deleteList({ listId: listId })}
        buttonColor="error"
      />
    );
  },
);
