import { SxProps, Tabs, Theme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { LinkTab, LinkTabProps } from './LinkTab';

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
    <Tabs
      value={selectedTab}
      onChange={(e, newValue) => setSelectedTab(newValue)}
      variant="scrollable"
      scrollButtons={false}
      sx={{
        width: '100%',
        '& .MuiTabs-indicator': {
          backgroundColor: '#ffd131',
          height: '3px',
        },
        '& .MuiTabs-flexContainer': {
          gap: '2rem !important',
        },
        ...(css ?? {})
      }}
    >
      {tabs.map((t) => (
        <LinkTab to={t.to} label={t.label} key={t.label} />
      ))}
    </Tabs>
  );
};

export default LinkTabs;
