import { Link } from '../../Link/Link';
import { StyledTab } from '../_base/StyledTab';

export interface LinkTabProps {
  label: string;
  to: string;
  highlighted?: boolean;
}

export const LinkTab = ({ highlighted, ...props }: LinkTabProps) => {
  return <StyledTab highlighted={highlighted} component={Link} {...props} />;
};
