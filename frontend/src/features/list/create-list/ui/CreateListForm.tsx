import React, { FC, useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { useUploadImage } from '../../update-list/utils/useUploadImage';
import { useCreateListModal } from '../utils/useCreateListModal';
import { composeValidators } from '@/shared/lib/forms/composeValidators';
import {
  maxLengthDescription,
  maxLengthName,
  requiredName,
} from '../utils/validators';
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

interface FormData {
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

  return (
    <>
      <FinalForm<FormData>
        onSubmit={async (form) => {
          await createListMutation.mutateAsync({
            isPublic: !form.isPrivate,
            description: form.description,
            name: form.name,
            imageUrl: uploadListImageMutation.data?.link,
          });
        }}
        render={({ handleSubmit, submitting, invalid }) => (
          <>
            <ModalBody>
              <Form
                css={{ mb: '$10' }}
                id="create-list-form"
                onSubmit={handleSubmit}
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
                      status={meta.modified && meta.error ? 'error' : 'default'}
                    />
                  )}
                </Field>
              </Form>

              <Field
                name="description"
                validate={maxLengthDescription}
                validateFields={[]}
              >
                {({ input, meta }) => (
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

              <Field name="isPrivate" validateFields={[]}>
                {({ input }) => (
                  <Checkbox
                    name={input.name}
                    onBlur={(e) =>
                      input.onBlur(e as React.FocusEvent<HTMLElement, Element>)
                    }
                    onFocus={(e) =>
                      input.onFocus(e as React.FocusEvent<HTMLElement, Element>)
                    }
                    onChange={(e) => input.onChange(e)}
                    value={input.value}
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
                loading={uploadListImageMutation.isLoading}
                loadedImageSrc={
                  uploadListImageMutation?.data?.link ?? undefined
                }
                onChange={handleUploadImage}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                form="create-list-form"
                type="submit"
                size="lg"
                disabled={invalid || uploadListImageMutation?.isLoading}
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
                {submitting ? (
                  <Loading size="lg" type="points" color="white" />
                ) : (
                  'Добавить'
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      />
    </>
  );
};
