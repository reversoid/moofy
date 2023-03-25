import { SxProps, Tabs, Theme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { LinkTab, LinkTabProps } from './LinkTab';
import { StyledTabs } from '../_base/StyledTabs';

export interface LinkTabsProps {
  tabs: LinkTabProps[];
  /** Is used to correctly display line under selected tab */
  tabValue: number;
  css?: SxProps<Theme>;
}

const LinkTabs: FC<LinkTabsProps> = ({ tabValue, tabs, css }) => {
  const [selectedTab, setSelectedTab] = useState(tabValue);

  useEffect(() => {
    setSelectedTab(tabValue);
  }, [tabValue]);

  return (
    <StyledTabs
      value={selectedTab}
      onChange={(e, newValue) => setSelectedTab(newValue)}
      sx={css ?? {}}
    >
      {tabs.map((t) => (
        <LinkTab to={t.to} label={t.label} key={t.label} />
      ))}
    </StyledTabs>
  );
};

export default LinkTabs;
