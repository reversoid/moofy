import {
  Button,
  ButtonProps,
  styled,
  cssFocusVisible,
} from '@nextui-org/react';
import { PropsWithChildren, forwardRef, useId, useState } from 'react';
import { SUPPORTED_EXTENSIONS } from './ImageUpload';

const Input = styled('input', {
  width: '0.1px',
  height: '0.1px',
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  zIndex: -1,
});

const Label = styled('label', cssFocusVisible);

interface BasicImageUploadProps {
  onFileSelect?: (file: File) => void;
}

export const BasicImageUpload = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<BasicImageUploadProps & ButtonProps>
>(({ onFileSelect, children, ...props }, ref) => {
  const id = useId();
  const [labelFocused, setLabelFocused] = useState(false);

  const handleFocus = () => {
    setLabelFocused(true);
  };

  const handleBlur = () => {
    setLabelFocused(false);
  };

  return (
    <>
      <Input
        type="file"
        id={id}
        accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          onFileSelect && onFileSelect(file);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Label
        htmlFor={id}
        isFocusVisible={labelFocused}
        css={{ borderRadius: '$md', width: '100%' }}
      >
        {children}
      </Label>
    </>
  );
});
