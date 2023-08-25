import LinkTabs from '@/shared/ui/Tabs/LinkTabs/LinkTabs';
import { Row, Text } from '@nextui-org/react';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUpdatesAmount } from './utils/useUpdatesAmount';

enum Tabs {
  'collections',
  'favorite',
  'updates',
}

const getTabNumericValueFromPath = (path: string) => {
  const currentPath = path.split('/').at(-1) ?? '';
  return Number(Tabs[currentPath as keyof typeof Tabs] ?? 0);
};

const Layout = () => {
  const { pathname } = useLocation();

  const tabValue = getTabNumericValueFromPath(pathname)

  const updatesAmount = useUpdatesAmount()

  return (
    <>
      <Text h1>
        Добро пожаловать!
      </Text>

      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <LinkTabs
          tabValue={tabValue}
          tabs={[
            { to: '/welcome/collections', label: 'Мои коллекции' },
            { to: '/welcome/favorite', label: 'Избранное' },
            { to: '/welcome/updates', label: 'Обновления', highlighted: Boolean(updatesAmount) }
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
