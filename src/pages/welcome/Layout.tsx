import LinkTabs from '@/shared/ui/Tabs/LinkTabs/LinkTabs';
import { Row, Text } from '@nextui-org/react';
import { Suspense, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

enum Tabs {
  'collections',
  'favorite',
}

const getTabNumericValueFromPath = (path: string) => {
  const currentPath = path.split('/').at(-1) ?? '';
  return Number(Tabs[currentPath as keyof typeof Tabs] ?? 0);
};

const Layout = () => {
  const { pathname } = useLocation();

  const tabValue = getTabNumericValueFromPath(pathname)

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

      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
