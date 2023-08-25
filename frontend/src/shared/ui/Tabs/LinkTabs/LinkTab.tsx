import { Link } from '../../Link/Link';
import { StyledTab } from '../_base/StyledTab';

export interface LinkTabProps {
  label: string;
  to: string;
  highlighted?: boolean;
  first?: boolean;
}

export const LinkTab = ({ highlighted, first, ...props }: LinkTabProps) => {  
  return (
    <StyledTab
      first={first}
      highlighted={highlighted}
      component={Link}
      {...props}
    />
  );
};
