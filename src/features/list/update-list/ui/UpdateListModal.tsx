import { Input } from '@/shared/ui/Input/Input';
import { Text, Button, Checkbox, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDefaultFormValues } from '../lib/useDefaultFormValues';
import { Form } from '@/shared/ui/Form/Form';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { $updateListState, clearState, updateList } from '../model';
import {
  $uploadImageListState,
  clearImageUploadState,
  uploadImage,
} from '../../_model/uploadImage';
import { ImageUpload } from '@/shared/components/ImageUpload';

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
}

export const UpdateListModal = memo(
  ({ isOpen, setIsOpen, listData, listId }: UpdateListModalProps) => {
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

    const onSubmit = useEvent(updateList);

    const { loading, success } = useStore($updateListState);

    const handleClose = () => {
      clearState();
      clearImageUploadState();
      setIsOpen(false);
    };

    useEffect(() => {
      if (!success) {
        return;
      }
      handleClose();
    }, [success]);

    const { loading: loadingImage, success: successImage } = useStore(
      $uploadImageListState,
    );

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
              onSubmit({
                isPublic: !isPrivate,
                name,
                description,
                listId,
                imageUrl: successImage?.link ?? undefined,
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
            loading={loadingImage}
            loadedImageSrc={successImage?.link ?? undefined}
            onChange={(file) => uploadImage({ file })}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            form="update-list-modal-form"
            type="submit"
            size="lg"
            disabled={!isFormValid || loadingImage}
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
