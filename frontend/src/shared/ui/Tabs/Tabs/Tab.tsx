import { Link } from '../../Link/Link';
import { StyledTab } from '../_base/StyledTab';

export interface TabProps {
  label: string;
}

export const Tab = (props: TabProps) => {
  return <StyledTab {...props} />;
};
