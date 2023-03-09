import LinkTabs from '@/shared/ui/LinkTabs/LinkTabs';
import { Row, Text, styled } from '@nextui-org/react';
import { memo, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/** Is used for containing button to load more collections */
export const LoadMoreContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: '$10',
});

enum Tabs {
  'collections',
  'favorite',
}

const Layout = () => {
  const { pathname } = useLocation();

  const tabValue = useMemo(() => {
    const currentPath = pathname.split('/').at(-1) ?? '';
    return Number(Tabs[currentPath as keyof typeof Tabs] ?? 1);
  }, [pathname]);

  return (
    <>
      <Text h1 css={{ mb: '$12' }}>
        Добро пожаловать!
      </Text>

      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <LinkTabs
          tabValue={tabValue}
          tabs={[
            { to: '/welcome/collections', label: 'Мои коллекции' },
            { to: '/welcome/favorite', label: 'Избранное' },
          ]}
          css={{ mb: '0.75rem' }}
        />
      </Row>

      <Outlet />
    </>
  );
};

export default memo(Layout);
