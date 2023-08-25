import { SxProps, Tabs, Theme } from '@mui/material';
import { FC, forwardRef, useEffect, useState } from 'react';
import { LinkTab, LinkTabProps } from './LinkTab';
import { StyledTabs } from '../_base/StyledTabs';
import { styled } from '@nextui-org/react';
import { MarkerRound } from '../../MarkerRound';

const TabWrapper = styled('div', {
  position: 'relative',
});

export const Round = styled(MarkerRound, {
  position: 'absolute',
  top: '0',
  right: '-1rem',
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
      {tabs.map((t, index) => (
        <LinkTab
          to={t.to}
          label={t.label}
          highlighted={t.highlighted}
          key={t.label}
          first={index === 0}
        />
      ))}
    </StyledTabs>
  );
};

export default LinkTabs;
