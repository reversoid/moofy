import { Button, styled } from '@nextui-org/react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Btn = styled(Button, {
  minWidth: 'auto !important',
  border: '2px solid transparent',
});

interface SelectButtonProps {
  url: string;
  isSelected: boolean;
  text: string;
}

export const SelectButton: FC<SelectButtonProps> = ({
  isSelected,
  text,
  url,
}) => {
  const navigate = useNavigate();

  return (
    <Btn rounded bordered={!isSelected} onClick={() => navigate(url)}>
      {text}
    </Btn>
  );
};
