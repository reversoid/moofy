import { setAppError } from '@/app';
import {
  ImageUpload,
  SUPPORTED_EXTENSIONS,
  getFileExtension,
} from '@/shared/components/ImageUpload';
import { composeValidators } from '@/shared/utils/forms/composeValidators';
import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { ModalBody, ModalFooter } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Checkbox, Loading } from '@nextui-org/react';
import { FC, useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import {
  maxLengthDescription,
  maxLengthName,
  requiredName,
} from '../../create-list/utils/validators';
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

  return (
    <FinalForm<FormData>
      initialValues={initialValues}
      onSubmit={async (form) => {
        await updateMutation.mutateAsync({
          isPublic: !form.isPrivate,
          name: form.name,
          description: form.description,
          listId,
          imageUrl: uploadImageMutation.data?.link ?? undefined,
        });
      }}
      render={({ handleSubmit, invalid }) => (
        <>
          <ModalBody>
            <Form
              onSubmit={handleSubmit}
              css={{ mb: '$10' }}
              id="update-list-modal-form"
            >
              <Field
                name="name"
                validate={composeValidators(requiredName, maxLengthName)}
                validateFields={[]}
              >
                {({ input, meta }) => (
                  <Input
                    {...input}
                    bordered
                    fullWidth
                    label="Название"
                    size="xl"
                    placeholder="Название123"
                    status={meta.error && 'error'}
                  />
                )}
              </Field>
            </Form>

            <Field
              name="description"
              validate={maxLengthDescription}
              validateFields={[]}
            >
              {({ input }) => (
                <Textarea
                  {...input}
                  maxLength={400}
                  bordered
                  size="xl"
                  label="Описание"
                  placeholder="Ваше описание коллекции"
                  maxRows={Infinity}
                />
              )}
            </Field>

            <Field<boolean> name="isPrivate" validateFields={[]}>
              {({ input }) => (
                <Checkbox
                  name={input.name}
                  isSelected={input.value}
                  onChange={input.onChange}
                  color="gradient"
                  label="Сделать коллекцию приватной"
                  css={{
                    '& .nextui-checkbox-text': {
                      fontSize: '$lg',
                    },
                  }}
                  size="lg"
                />
              )}
            </Field>

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
              disabled={invalid || uploadImageMutation.isLoading}
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
        </>
      )}
    />
  );
};
