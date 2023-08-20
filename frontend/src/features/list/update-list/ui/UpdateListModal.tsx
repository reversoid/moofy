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
import { Field, Form as FinalForm } from 'react-final-form';
import { composeValidators } from '@/shared/lib/forms/composeValidators';
import {
  maxLengthDescription,
  maxLengthName,
  requiredName,
} from '../../create-list/utils/validators';
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

    const initialValues = {
      name: listData.name,
      description: listData.description,
      isPrivate: listData.isPrivate
    }

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
      <>
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
            validateFields={[]}>
              {({ input }) => (
            <Textarea
              {...input}
              maxLength={400}
              bordered
              size="xl"
              label="Описание"
              placeholder="Ваше описание коллекции"
              maxRows={Infinity}
            /> )}
          </Field>
            
          <Field name="isPrivate" validateFields={[]}
          >{({ input }) => (
            <Checkbox
              name={input.name}
              color="gradient"
              label="Сделать коллекцию приватной"
              css={{
                '& .nextui-checkbox-text': {
                  fontSize: '$lg',
                },
              }}
              size="lg"
              defaultSelected={listData.isPrivate}
            />)}
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
        </Modal>
        </>
        )}
      />
    </>
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
