import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { ModalFooter, Modal, ModalBody, ModalHeader } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Text, Button, Checkbox, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { $createListState, clearState, createList } from '../model';

interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

interface CreateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

export const CreateListModal = memo(({ isOpen, setIsOpen }: CreateListModalProps) => {
  const {
    register,
    formState: { isValid: isFormValid, errors },
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: { isPrivate: false },
    mode: 'onChange',
  });

  const onSubmit = useEvent(createList);
  const onClose = useEvent(clearState);

  const { loading, success } = useStore($createListState);

  const handleClose = () => {
    reset();
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
    >
      <ModalHeader>
        <Text h3>Создать коллекцию</Text>
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={handleSubmit(({ description, isPrivate, name }) =>
            onSubmit({ isPublic: !isPrivate, name, description }),
          )}
          id="create-list-modal-form"
        >
          <Input
            bordered
            fullWidth
            label="Название"
            size="xl"
            placeholder="Название123"
            status={errors.name && 'error'}
            {...register('name', {
              required: { value: true, message: 'Поле не должно быть пустым' },
              maxLength: { value: 32, message: 'Слишком длинное название' },
            })}
          />
          <Textarea
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание коллекции"
            {...register('description', {
              maxLength: { value: 400, message: 'Слишком длинное описание' },
            })}
            initialValue={getValues('description')}
          />
          <Checkbox
            color="gradient"
            label="Сделать коллекцию приватной"
            css={{
              '& .nextui-checkbox-text': {
                fontSize: '$lg',
              },
            }}
            size="lg"
            {...register('isPrivate')}
            defaultSelected={getValues().isPrivate}
            onChange={(newValue) => setValue('isPrivate', newValue)}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          form="create-list-modal-form"
          type="submit"
          size="lg"
          disabled={!isFormValid}
          color={'gradient'}
          auto
          css={{
            minWidth: '7.5rem',
            m: 0,
            '@xsMax': {
              width: '100%',
            },
          }}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Добавить'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
});