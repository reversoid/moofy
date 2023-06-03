import { Button, ButtonProps, styled } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { PropsWithChildren, forwardRef, useState } from 'react';
import { SUPPORTED_EXTENSIONS } from './ImageUpload';

const Input = styled('input', {
  display: 'none',
});

interface BasicImageUploadProps {
  onFileSelect?: (file: File) => void;
}

export const BasicImageUpload = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<BasicImageUploadProps & ButtonProps>
>(({ onFileSelect, children, ...props }, ref) => {
  const [id] = useState(nanoid());

  const handleClick = () => {
    document.getElementById(id)?.click();
  };

  return (
    <Button
      {...{
        ...props,
        css: {
          width: 'auto',
          height: 'auto',
          p: '0',
          minWidth: 'auto',
          flexShrink: '0',
          ...props.css,
        },
      }}
      ref={ref}
      light
      ripple={false}
      onClick={handleClick}
    >
      <Input
        type="file"
        hidden
        id={id}
        accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          onFileSelect && onFileSelect(file);
        }}
      />
      {children}
    </Button>
  );
});
