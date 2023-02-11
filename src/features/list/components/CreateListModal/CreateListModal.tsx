import {
  $createListSuccess,
  createList,
  createListFx,
  removeSuccessStatus,
} from '@/models/lists/createList';
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
import { useEffect } from 'react';
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

interface CreateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

const CreateListModal = ({ isOpen, setIsOpen }: CreateListModalProps) => {
  const {
    register,
    formState: { isValid: isFormValid, errors },
    getValues,
    setValue,
    handleSubmit,
    resetField,
  } = useForm<FormData>({
    defaultValues: { isPrivate: false },
    mode: 'onChange',
  });

  const onSubmit = useEvent(createList);
  const onClose = useEvent(removeSuccessStatus);

  const loading = useStore(createListFx.pending);
  const success = useStore($createListSuccess);

  const handleClose = () => {
    resetField('name');
    resetField('description');
    resetField('isPrivate');
    setIsOpen(false);
    onClose();
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
        <Text h3>Создать список</Text>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(({ description, isPrivate, name }) =>
            onSubmit({ isPublic: !isPrivate, name, description }),
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
              maxLength: { value: 400, message: 'Слишком длинное описание' },
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
            defaultSelected={getValues().isPrivate}
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
            'Добавить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateListModal;
