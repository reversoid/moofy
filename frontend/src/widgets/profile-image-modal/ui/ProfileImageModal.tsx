import { BasicImageUpload } from '@/shared/components/BasicImageUpload';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { uploadProfileImage } from '../model/upload-image';
import { deleteProfileImage } from '../model/delete-image';

const Image = styled('img', {
  width: '25rem',
  height: '25rem',
  objectFit: 'contain',
  flexShrink: 2,
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

export interface ProfileImageModalProps {
  imageUrl: string | null;
  opened: boolean;
}

export const ProfileImageModal: FC<ProfileImageModalProps> = ({ imageUrl }) => {
  const onFileSelected = (file: File) => uploadProfileImage({ file });
  const onDeleteClicked = () => deleteProfileImage();

  return (
    <Modal open={true} closeButton={true}>
      <ModalBody css={{ display: 'flex', ai: 'center', pt: '$10' }}>
        {/* TODO check for empty image url and show placeholder */}
        <Image src={imageUrl ?? ''}></Image>
      </ModalBody>
      <ModalFooter css={{ display: 'flex', ai: 'center', jc: 'center' }}>
        <ButtonContainer>
          <BasicImageUpload
            css={{
              flexGrow: 1,
              display: 'flex',
              '@xsMax': {
                width: '100%',
                '& span.nextui-button-text': { width: '100%' },
              },
            }}
            onFileSelect={onFileSelected}
          >
            <Button
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
          >
            Удалить
          </Button>
        </ButtonContainer>
      </ModalFooter>
    </Modal>
  );
};
