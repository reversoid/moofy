import {
  Modal,
  Text,
  Textarea,
  Button,
  Input,
  Checkbox,
  styled,
} from '@nextui-org/react';
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
    formState: { isValid: isFormValid },
    getValues,
    setValue,
  } = useForm<FormData>({ defaultValues: { isPrivate: false } });

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
        <Form>
          <Input
            bordered
            label="Название списка"
            size="xl"
            placeholder="Название123"
            {...register('name', {
              required: { value: true, message: 'Поле не должно быть пустым' },
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
            defaultSelected={getValues().isPrivate}
            onChange={(newValue) => setValue('isPrivate', newValue)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={!isFormValid}
          color={'gradient'}
          auto
          onClick={() => console.log(getValues())}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateListModal;
