import { Wrapper } from './Layout';
import { Text, styled, Link } from '@nextui-org/react';
import { Link as MyLink } from '@/shared/ui/Link/Link';

const Div = styled('div', {});
const PagesWrapper = styled('div', {
  display: 'flex',
  gap: '$7',
});

const LinkStyled = styled(MyLink, {
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
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 0,
        flexShrink: 0,
        width: '100%',
        pt: '$10',
        pb: '$8',
        '@xsMax': {
          flexDirection: 'column',
          gap: '$5',
          pb: '$10',
        },
      }}
    >
      <Div css={{ display: 'flex', alignItems: 'center', gap: '$3' }}>
        <Text color="$neutral">Created by</Text>{' '}
        <Link
          href="https://github.com/reversoid"
          target="_blank"
          rel="noopener noreferrer"
        >
          reversoid
        </Link>
      </Div>
      <PagesWrapper>
        <Link
          href="https://github.com/reversoid/moofy-frontend"
          target="_blank"
          rel="noopener noreferrer"
          css={{
            color: '$neutral',
            '&:hover': {
              color: '$primary',
              opacity: 1,
              transition: 'color 0.05s linear',
            },
          }}
        >
          Github
        </Link>
        <LinkStyled to="/support" css={{ color: '$neutral' }}>
          Поддержка
        </LinkStyled>
        <LinkStyled to="/help" css={{ color: '$neutral' }}>
          Помочь проекту
        </LinkStyled>
      </PagesWrapper>
    </Wrapper>
  );
}

export default Footer;
