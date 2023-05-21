import { SxProps, Theme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Tab, TabProps } from './Tab';
import { StyledTabs } from '../_base/StyledTabs';

export interface LinkTabsProps {
  tabs: TabProps[];
  /** Is used to correctly display line under selected tab */
  tabValue: number;
  css?: SxProps<Theme>;
  onChange: (newValue: number) => void;
}

const Tabs: FC<LinkTabsProps> = ({ tabValue, tabs, css, onChange }) => {
  const [selectedTab, setSelectedTab] = useState(tabValue);

  useEffect(() => {
    setSelectedTab(tabValue);
  }, [tabValue]);

  return (
    <StyledTabs
      value={selectedTab}
      onChange={(e, newValue: number) => {
        setSelectedTab(newValue);
        onChange(newValue);
      }}
      sx={css}
    >
      {tabs.map((t) => (
        <Tab label={t.label} key={t.label} />
      ))}
    </StyledTabs>
  );
};

export default Tabs;
