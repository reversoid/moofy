import { setAppError } from '@/app';
import {
  ImageUpload,
  SUPPORTED_EXTENSIONS,
  getFileExtension,
} from '@/shared/components/ImageUpload';
import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Checkbox, Loading, Text } from '@nextui-org/react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDefaultFormValues } from '../lib/useDefaultFormValues';
import { useUpdateList } from '../lib/useUpdateList';
import { useUploadImage } from '../lib/useUploadImage';

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
    const {
      register,
      formState: { isValid: isFormValid, errors },
      setValue,
      handleSubmit,
      getValues,
    } = useForm<FormData>({
      mode: 'onChange',
    });

    useDefaultFormValues(isOpen, setValue, listData);

    const updateMutation = useUpdateList();
    const uploadImageMutation = useUploadImage();

    const handleClose = () => {
      uploadImageMutation.reset();
      setIsOpen(false);
    };

    useEffect(() => {
      if (!updateMutation.isSuccess) {
        return;
      }
      handleClose();
    }, [updateMutation.isSuccess]);

    const handleUploadImage = (file: File) => {
      const extension = getFileExtension(file);

      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        return setAppError('IMAGE_WRONG_FORMAT');
      }

      if (file.size > 10 * 1024 * 1024) {
        return setAppError('IMAGE_TOO_LARGE');
      }

      uploadImageMutation.mutate(file);
    };

    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader>
          <Text h3>Изменить коллекцию</Text>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit(({ description, isPrivate, name }) =>
              updateMutation.mutate({
                isPublic: !isPrivate,
                name,
                description,
                listId,
                imageUrl: uploadImageMutation.data?.link ?? undefined,
              }),
            )}
            css={{ mb: '$10' }}
            id="update-list-modal-form"
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
              defaultSelected={listData.isPrivate}
              onChange={(newValue) => setValue('isPrivate', newValue)}
            />
          </Form>
          <ImageUpload
            text="Загрузить обложку"
            loading={uploadImageMutation.isLoading}
            loadedImageSrc={
              uploadImageMutation.data?.link ?? listImageUrl ?? undefined
            }
            onChange={handleUploadImage}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            form="update-list-modal-form"
            type="submit"
            size="lg"
            disabled={!isFormValid || uploadImageMutation.isLoading}
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
            {updateMutation.isLoading ? (
              <Loading size="lg" type="points" color="white" />
            ) : (
              'Обновить'
            )}
          </Button>
        </ModalFooter>
      </Modal>
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
