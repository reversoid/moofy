import { Form } from '@/shared/ui/Form/Form';
import { Input } from '@/shared/ui/Input/Input';
import { ModalFooter, Modal, ModalBody, ModalHeader } from '@/shared/ui/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Text, Button, Checkbox, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { $createListState, clearState, createList } from '../model';
import { PictureIcon } from '@/shared/Icons/Picture.icon';
import { ImageUpload } from '../../../../shared/components/ImageUpload';
import { listService } from '../../_api/list.service';
import { $uploadImageListState, clearImageUploadState, uploadImage } from '../../_model/uploadImage';

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

    const onSubmit = useEvent(createList);

    const { loading, success } = useStore($createListState);

    const { loading: loadingImage, success: successImage } = useStore(
      $uploadImageListState,
    );

    const handleClose = () => {
      reset();
      setIsOpen(false);
      clearImageUploadState();
      clearState();
    };

    useEffect(() => {
      if (!success) {
        return;
      }
      handleClose();
    }, [success]);

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
              onSubmit({
                isPublic: !isPrivate,
                name,
                description,
                imageUrl: successImage?.link ?? undefined,
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
            loading={loadingImage}
            loadedImageSrc={successImage?.link ?? undefined}
            onChange={(file) => uploadImage({ file })}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            form="create-list-modal-form"
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
              'Добавить'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    );
  },
);
