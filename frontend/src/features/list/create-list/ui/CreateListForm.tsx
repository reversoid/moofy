import React, { FC, useEffect } from 'react';
import { useUploadImage } from '../../update-list/utils/useUploadImage';
import { useCreateListModal } from '../utils/useCreateListModal';
import { DESCRIPTION_OPTIONS, NAME_OPTIONS } from '../utils/fieldOptions';
import { Input } from '@/shared/ui/Input/Input';
import { Form } from '@/shared/ui/Form/Form';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Checkbox, Loading } from '@nextui-org/react';
import {
  ImageUpload,
  SUPPORTED_EXTENSIONS,
  getFileExtension,
} from '@/shared/components/ImageUpload';
import { setAppError } from '@/app';
import { ModalBody, ModalFooter } from '@/shared/ui/Modal';
import { useForm } from 'react-hook-form';

export interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface CreateListFormProps {
  onSuccess: () => void;
}

export const CreateListForm: FC<CreateListFormProps> = ({ onSuccess }) => {
  const createListMutation = useCreateListModal();
  const uploadListImageMutation = useUploadImage();

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

  useEffect(() => {
    if (!createListMutation.isSuccess) {
      return;
    }
    onSuccess();
  }, [createListMutation.isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm<FormData>({ mode: 'onChange' });

  const handleFormSubmit = handleSubmit((form) => {
    return createListMutation.mutateAsync({
      isPublic: !form.isPrivate,
      description: form.description,
      name: form.name,
      imageUrl: uploadListImageMutation.data?.link,
    });
  });

  const _registerCheckbox = register('isPrivate');

  return (
    <>
      <ModalBody>
        <Form
          css={{ mb: '$10' }}
          id="create-list-form"
          onSubmit={handleFormSubmit}
        >
          <Input
            {...register('name', NAME_OPTIONS)}
            bordered
            fullWidth
            label="Название"
            size="xl"
            placeholder="Название123"
            status={errors.name ? 'error' : 'default'}
          />

          <Textarea
            {...register('description', DESCRIPTION_OPTIONS)}
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание коллекции"
            maxRows={Infinity}
          />

          <Checkbox
            name={_registerCheckbox.name}
            onChange={(selected) => {
              setValue('isPrivate', selected);
            }}
            defaultSelected={false}
            color="gradient"
            label="Сделать коллекцию приватной"
            css={{
              '& .nextui-checkbox-text': {
                fontSize: '$lg',
              },
            }}
            size="lg"
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
          form="create-list-form"
          type="submit"
          size="lg"
          disabled={
            !isValid || isSubmitting || uploadListImageMutation.isLoading
          }
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
          {isSubmitting ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Добавить'
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
