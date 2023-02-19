import React, { memo } from 'react';
import { Wrapper } from './Layout';
import { Image, Text, styled } from '@nextui-org/react';
import logo from '@/assets/img/Logo2.svg';
import { Link } from '@/shared/ui/Link';

const LogoWrapper = styled('div', {});
const PagesWrapper = styled('div', {
  display: 'flex',
  gap: '$10',
});

const LinkStyled = styled(Link, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  transition: 'color 0.05s linear',
  '&:hover': {
    color: '$primary',
  },
});
function Footer() {
  return (
    <Wrapper
      lg
      css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        pt: '$5',
        pb: '$5'
      }}
    >
      <PagesWrapper>
        <LinkStyled to="" css={{ color: '$neutral' }}>
          Поддержка
        </LinkStyled>
        <LinkStyled to="" css={{ color: '$neutral' }}>
          Помочь проекту
        </LinkStyled>
      </PagesWrapper>
    </Wrapper>
  );
}

export default memo(Footer);
