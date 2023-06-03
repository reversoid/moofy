import { DividerProps, styled } from '@nextui-org/react';
import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  PropsWithRef,
  PropsWithoutRef,
  Ref,
  forwardRef,
  useState,
} from 'react';
import { SUPPORTED_EXTENSIONS } from './ImageUpload';
import { nanoid } from 'nanoid';

const Input = styled('input', {
  display: 'none',
});

const Wrapper = styled('div', {
  position: 'relative',
});

const Label = styled('label', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

interface BasicImageUploadProps {
  onChange?: (file: File) => void;
  wrapperProps?: ComponentProps<typeof Label>
}

export const BasicImageUpload = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BasicImageUploadProps> & ComponentProps<typeof Wrapper>
>(({ onChange, children, wrapperProps, ...props }, ref) => {
  const [id] = useState(nanoid());

  return (
    <Wrapper ref={ref} {...props}>
      <Input
        type="file"
        hidden
        id={id}
        accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          onChange && onChange(file);
        }}
      />
      <Label htmlFor={id} {...wrapperProps}>{children}</Label>
    </Wrapper>
  );
});
