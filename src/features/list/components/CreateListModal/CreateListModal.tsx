import InfoIconWithTooltip from '@/shared/ui/InfoIconWithTooltip';
import { Input } from '@/shared/ui/Input';
import {
  Modal,
  Text,
  Textarea,
  Button,
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
    formState: { isValid: isFormValid, errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: { isPrivate: false },
    mode: 'onChange',
  });

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
            fullWidth
            label="Название списка"
            size="xl"
            placeholder="Название123"
            status={errors.name && 'error'}
            contentRight={
              errors.name?.message && (
                <InfoIconWithTooltip message={errors.name.message} />
              )
            }
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
