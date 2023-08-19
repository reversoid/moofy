import { useEffect } from 'react';
import { PageTabs } from '../ui/ListsSection/ListsSection';

export const useListsRefetch = (
  currentTab: PageTabs,
  tabToActOn: PageTabs,
  refetch: () => void,
) => {
  useEffect(() => {
    if (currentTab === tabToActOn) {
      refetch();
    }
  }, [currentTab]);
};
