import { setAppError } from '@/app';
import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Checkbox, Loading, Text } from '@nextui-org/react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ImageUpload,
  SUPPORTED_EXTENSIONS,
  getFileExtension,
} from '../../../../shared/components/ImageUpload';
import { useUploadImage } from '../../update-list/lib/useUploadImage';
import { useCreateListModal } from '../lib/useCreateListModal';

interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

interface CreateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

export const CreateListModal = memo(
  ({ isOpen, setIsOpen }: CreateListModalProps) => {
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

    const createListMutation = useCreateListModal();
    const uploadListImageMutation = useUploadImage();

    const handleClose = () => {
      reset();
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

    const handleUploadImage = (file: File) => {
      const extension = getFileExtension(file);

      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        return setAppError('IMAGE_WRONG_FORMAT');
      }

      if (file.size > 10 * 1024 * 1024) {
        return setAppError('IMAGE_TOO_LARGE');
      }

      uploadListImageMutation.mutate(file);
    };

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
              createListMutation.mutate({
                isPublic: !isPrivate,
                name,
                description,
                imageUrl: uploadListImageMutation.data?.link ?? undefined,
              }),
            )}
            css={{ mb: '$10' }}
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
                required: {
                  value: true,
                  message: 'Поле не должно быть пустым',
                },
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
              maxRows={Infinity}
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
          <ImageUpload
            text="Загрузить обложку"
            loading={uploadListImageMutation.isLoading}
            loadedImageSrc={uploadListImageMutation?.data?.link ?? undefined}
            onChange={handleUploadImage}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            form="create-list-modal-form"
            type="submit"
            size="lg"
            disabled={!isFormValid || uploadListImageMutation?.isLoading}
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
            {createListMutation.isLoading ? (
              <Loading size="lg" type="points" color="white" />
            ) : (
              'Добавить'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    );
  },
);
