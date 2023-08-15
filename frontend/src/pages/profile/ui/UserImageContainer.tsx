import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { styled, CSS } from '@nextui-org/react';
import React, { FC, MouseEventHandler, PropsWithChildren, memo } from 'react';

const styles: CSS = {
  borderRadius: '50%',
  backgroundColor: '$gray100',
  width: '6rem !important',
  height: '6rem !important',
  display: 'flex',
  ai: 'center',
  jc: 'center',
};

const OwnerImageContainer = styled(IconButton, styles);

const VisitorImageContainer = styled('div', styles);

export interface UserImageContainerProps {
  isOwner: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const UserImageContainer: FC<PropsWithChildren<UserImageContainerProps>> = ({
  isOwner,
  children,
  onClick
}) => {
  if (isOwner) {
    return <OwnerImageContainer onClick={onClick}>{children}</OwnerImageContainer>
  }
  return <VisitorImageContainer>{children}</VisitorImageContainer>
};
