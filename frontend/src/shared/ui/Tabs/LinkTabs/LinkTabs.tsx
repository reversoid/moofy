import { SxProps, Tabs, Theme } from '@mui/material';
import { FC, forwardRef, useEffect, useState } from 'react';
import { LinkTab, LinkTabProps } from './LinkTab';
import { StyledTabs } from '../_base/StyledTabs';
import { styled } from '@nextui-org/react';

const TabWrapper = styled('div', {
  position: 'relative',
});

const Round = styled('div', {
  position: 'absolute',
  top: '0',
  right: '-1rem',
  width: '0.75rem',
  height: '0.75rem',
  background: '#f8d355dd',
  borderRadius: '50%',
});

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
        <LinkTab to={t.to} label={t.label} highlighted={t.highlighted} key={t.label} />
      ))}
    </StyledTabs>
  );
};

export default LinkTabs;
