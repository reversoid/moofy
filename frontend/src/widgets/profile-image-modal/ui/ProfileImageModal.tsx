import { BasicImageUpload } from '@/shared/components/BasicImageUpload';
import { Modal, ModalBody, ModalFooter } from '@/shared/ui/Modal';
import { Button, Loading, styled } from '@nextui-org/react';
import { FC, useEffect } from 'react';
import { PictureIcon } from '@/shared/Icons/Picture.icon';
import { notify } from '@/app';
import { useUnmount } from '@/shared/hooks/useUnmount';
import { useUploadAndSaveImage } from '../utils/useUploadImage';
import { useDeleteImage } from '../utils/useDeleteImage';

const ImageContainer = styled('div', {
  width: 'min(100%, 25rem)',
  paddingTop: 'min(100%, 25rem)',
  flexShrink: 2,
  display: 'flex',
  ai: 'center',
  jc: 'center',
  position: 'relative',
});

const Image = styled('img', {
  objectFit: 'contain',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '$xs',
  variants: {
    loading: {
      true: {
        filter: 'grayscale(100%) blur(3px)',
      },
    },
  },
});

const EmptyImagePlaceholderWrapper = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

const ButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  jc: 'center',
  '@xsMax': { flexDirection: 'column' },
  width: '100%',
  maxWidth: '25rem',
  gap: '$6',
  margin: '0 !important',
  pb: '$8',
});

const LoadingWrapper = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  ai: 'center',
  jc: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export interface ProfileImageModalProps {
  imageUrl: string | null;
  opened: boolean;
  setOpened: (newValue: boolean) => void;
}

export const ProfileImageModal: FC<ProfileImageModalProps> = ({
  imageUrl,
  opened,
  setOpened,
}) => {
  const uploadAndSaveMutation = useUploadAndSaveImage();
  const deleteImageMutation = useDeleteImage();

  const onFileSelected = (file: File) => uploadAndSaveMutation.mutate(file);
  const onDeleteClicked = () => deleteImageMutation.mutate();

  useEffect(() => {
    if (!uploadAndSaveMutation.isSuccess) {
      return;
    }
    setOpened(false);
    notify('Изображение загружено');
    uploadAndSaveMutation.reset();
  }, [uploadAndSaveMutation.isSuccess]);

  useEffect(() => {
    if (!deleteImageMutation.isSuccess) {
      return;
    }
    setOpened(false);
    notify('Изображение удалено');
    deleteImageMutation.reset();
  }, [deleteImageMutation.isSuccess]);

  useUnmount(() => {
    deleteImageMutation.reset();
    uploadAndSaveMutation.reset();
  });

  const loading =
    deleteImageMutation.isLoading || uploadAndSaveMutation.isLoading;

  return (
    <Modal open={opened} closeButton={true} onClose={() => setOpened(false)}>
      <ModalBody
        css={{ display: 'flex', ai: 'center', pt: '$10', position: 'relative' }}
      >
        <ImageContainer>
          {imageUrl ? (
            <Image src={imageUrl ?? ''} loading={loading}></Image>
          ) : (
            <EmptyImagePlaceholderWrapper>
              <PictureIcon color={'#3A3F42'} size="12rem" />
            </EmptyImagePlaceholderWrapper>
          )}

          {loading && (
            <LoadingWrapper>
              <Loading size="xl" />
            </LoadingWrapper>
          )}
        </ImageContainer>
      </ModalBody>
      <ModalFooter css={{ display: 'flex', ai: 'center', jc: 'center' }}>
        <ButtonContainer>
          <BasicImageUpload
            css={{
              flexGrow: 1,
              display: 'flex',
              ai: 'center',
              '@xsMax': {
                width: '100%',
                '& span.nextui-button-text': { width: '100%' },
              },
            }}
            onFileSelect={onFileSelected}
          >
            <Button
              as={'div'}
              tabIndex={-1}
              color={'default'}
              css={{ flexGrow: 1, '@xsMax': { width: '100%' } }}
            >
              Загрузить
            </Button>
          </BasicImageUpload>

          <Button
            color={'error'}
            css={{ flexGrow: 1, '@xsMax': { width: '100%' } }}
            onClick={onDeleteClicked}
            disabled={!imageUrl}
          >
            Удалить
          </Button>
        </ButtonContainer>
      </ModalFooter>
    </Modal>
  );
};
