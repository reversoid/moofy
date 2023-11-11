import { Collapse as _Collapse, Text, styled } from '@nextui-org/react';

interface DescriptionCollapseProps {
  description: string;
}

const Description = styled(Text, {
  padding: '0 0 $2',
  wordBreak: 'break-word',
  width: '100%',
  fontSize: '$md',
});

const Collapse = styled(_Collapse, {
  '.nextui-collapse-title': {
    fontSize: '$lg',
    minWidth: '250px',
  },
  '.nextui-c-lfcDHB': {
    padding: '$2 0 $1 0',
  },
  '.nextui-collapse-content': {
    padding: '$1 0',
  },
});

const DescriptionCollapse: React.FC<DescriptionCollapseProps> = ({
  description,
}) => {
  const makeSubtitle = (string: string) => {
    const descriptionArr = string.split(' ');
    return descriptionArr.length > 3
      ? descriptionArr.slice(0, 3).join(' ') + '...'
      : descriptionArr.slice(0, 3).join(' ');
  };
  return (
    <Collapse
      showArrow={Boolean(description.length)}
      expanded={false}
      title="Описание"
      disabled={!Boolean(description.length)}
      subtitle={
        description ? makeSubtitle(description) : 'Описание отсутствует'
      }
    >
      <Description>{description}</Description>
    </Collapse>
  );
};

export default DescriptionCollapse;
