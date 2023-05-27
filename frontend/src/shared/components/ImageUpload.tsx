import { PictureIcon } from '@/shared/Icons/Picture.icon';
import { Loading, styled, Text } from '@nextui-org/react';
import React, { FC } from 'react';

const Input = styled('input');
const Label = styled('label', {
  width: '100%',
  height: '8rem',
  overflow: 'hidden',
  borderRadius: '$xl',
  border: '3px dashed $neutral',
  cursor: 'pointer',
  padding: '$5',
  gap: '$2',
  position: 'relative',
  display: 'flex',
});

const IconContainer = styled('div', {
  width: '4rem',
  height: '4rem',
  dflex: 'center',
});

const LoadedImage = styled('img', {
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  filter: 'blur(5px) opacity(25%)',
});

const LabelContent = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  display: 'flex',
  jc: 'center',
  ai: 'center',
  flexDirection: 'column',
});

export const SUPPORTED_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp', 'heif'];

export const getFileExtension = (file: File) => file.name.toLowerCase().split('.').at(-1) ?? '';

export interface ImageUploadProps {
  onChange?: (file: File) => void;
  loading?: boolean;
  loadedImageSrc?: string;
  text: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({
  onChange,
  text,
  loadedImageSrc,
  loading,
}) => {
  return (
    <div>
      <Input
        type="file"
        hidden
        id="fileInput"
        accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          onChange && onChange(file);
        }}
      />

      <Label htmlFor="fileInput">
        <LabelContent>
          <IconContainer>
            {loading ? (
              <Loading size="lg" />
            ) : (
              <PictureIcon size="4rem" color="#ecedee" />
            )}
          </IconContainer>

          <Text size={'$lg'} css={{ fontWeight: 500 }}>
            {text}
          </Text>
        </LabelContent>

        <LoadedImage src={loadedImageSrc} />
      </Label>
    </div>
  );
};
