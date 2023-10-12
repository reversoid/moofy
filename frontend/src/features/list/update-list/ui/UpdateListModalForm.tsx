import { setAppError } from '@/app';
import {
  ImageUpload,
  SUPPORTED_EXTENSIONS,
  getFileExtension,
} from '@/shared/components/ImageUpload';
import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { ModalBody, ModalFooter } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Checkbox, Loading } from '@nextui-org/react';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  DESCRIPTION_OPTIONS,
  NAME_OPTIONS,
} from '../../create-list/utils/fieldOptions';
import { useUpdateList } from '../utils/useUpdateList';
import { useUploadImage } from '../utils/useUploadImage';
import { FormData } from './UpdateListModal';

interface UpdateListModalFormProps {
  initialValues: FormData;
  onClose: () => void;
  listId: number;
  listImageUrl: string | undefined;
}

export const UpdateListModalForm: FC<UpdateListModalFormProps> = ({
  initialValues,
  onClose,
  listId,
  listImageUrl,
}) => {
  const updateMutation = useUpdateList();
  const uploadImageMutation = useUploadImage();
  const {
    register,
    formState: { isSubmitting, isValid, errors },
    handleSubmit,
    setValue,
  } = useForm<FormData>({ values: initialValues, mode: 'onChange' });

  useEffect(() => {
    if (!updateMutation.isSuccess) {
      return;
    }
    uploadImageMutation.reset();
    onClose();
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

  const handleFormSubmit = handleSubmit((form) =>
    updateMutation.mutateAsync({
      isPublic: !form.isPrivate,
      name: form.name,
      description: form.description,
      listId,
      imageUrl: uploadImageMutation.data?.link ?? undefined,
    }),
  );

  const _registerCheckbox = register('isPrivate');

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={handleFormSubmit}
          css={{ mb: '$10' }}
          id="update-list-modal-form"
        >
          <Input
            {...register('name', NAME_OPTIONS)}
            bordered
            fullWidth
            label="Название"
            size="xl"
            placeholder="Название"
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
            status={errors.description ? 'error' : 'default'}
          />

          <Checkbox
            name={_registerCheckbox.name}
            onChange={(selected) => {
              setValue('isPrivate', selected);
            }}
            defaultSelected={initialValues.isPrivate}
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
          disabled={!isValid || uploadImageMutation.isLoading || isSubmitting}
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
            'Обновить'
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
