import { ModalProps, Modal as _Modal, styled } from '@nextui-org/react';
import { FC } from 'react';

export const Modal: FC<ModalProps> = (props) => {
  return <_Modal {...{ width: '45rem', ...props }} />;
};

