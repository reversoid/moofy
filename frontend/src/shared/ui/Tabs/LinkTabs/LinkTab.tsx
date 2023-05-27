import { Link } from '../../Link/Link';
import { StyledTab } from '../_base/StyledTab';

export interface LinkTabProps {
  label: string;
  to: string;
}

export const LinkTab = (props: LinkTabProps) => {
  return (
    <StyledTab
      component={Link}
      {...props}
    />
  );
};
