import {
  updateList,
  $updateListSuccess,
  removeSuccessStatus,
  updateListFx,
} from '@/models/lists/updateList';
import { Input } from '@/shared/ui/Input';
import {
  Modal,
  Text,
  Textarea,
  Button,
  Checkbox,
  styled,
  Loading,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$10',
});

interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

interface UpdateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  form: FormData;
  listId: number;
}

const UpdateListModal = ({
  isOpen,
  setIsOpen,
  form: { name, isPrivate, description },
  listId,
}: UpdateListModalProps) => {
  const {
    register,
    formState: { isValid: isFormValid, errors },
    setValue,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: { isPrivate, name, description },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setValue('name', name);
    setValue('description', description);
    setValue('isPrivate', isPrivate);
  }, [isOpen]);

  const onSubmit = useEvent(updateList);
  const onClose = useEvent(removeSuccessStatus);

  const loading = useStore(updateListFx.pending);
  const success = useStore($updateListSuccess);

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!success) {
      return;
    }
    handleClose();
  }, [success]);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width="45rem"
    >
      <Modal.Header>
        <Text h3>Изменить список</Text>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(({ description, isPrivate, name }) =>
            onSubmit({ isPublic: !isPrivate, name, description, listId }),
          )}
          id="create-list-modal-form"
        >
          <Input
            bordered
            fullWidth
            label="Название списка"
            size="xl"
            placeholder="Название123"
            status={errors.name && 'error'}
            {...register('name', {
              required: { value: true, message: 'Поле не должно быть пустым' },
              maxLength: { value: 32, message: 'Слишком длинное название' },
            })}
          />
          <Textarea
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание списка"
            {...register('description', {
              maxLength: { value: 280, message: 'Слишком длинное описание' },
            })}
          />
          <Checkbox
            color="gradient"
            label="Сделать список приватным"
            css={{
              '& .nextui-checkbox-text': {
                fontSize: '$lg',
              },
            }}
            {...register('isPrivate')}
            defaultSelected={isPrivate}
            onChange={(newValue) => setValue('isPrivate', newValue)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          form="create-list-modal-form"
          type="submit"
          size="lg"
          disabled={!isFormValid}
          color={'gradient'}
          auto
          css={{ minWidth: '7.5rem' }}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Обновить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(UpdateListModal, (prev, next) => {
  const formEqual =
    (prev.form.description === next.form.description &&
      prev.form.isPrivate === next.form.isPrivate) ??
    prev.form.name === next.form.name;
  return (
    formEqual && prev.isOpen === next.isOpen && prev.listId === next.listId
  );
});
