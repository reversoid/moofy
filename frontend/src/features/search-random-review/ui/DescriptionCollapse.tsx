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
  width: '100%',
  '.nextui-collapse-title': {
    fontSize: '$lg',
  },
  '.nextui-collapse-view': {
    py: '$2',
  },
  '.nextui-collapse-content': {
    pb: '$1',
  },
  '.nextui-collapse-title-content': {
    // subtract with of arrow size
    width: 'calc(100% - 20px)',
  },
  mt: '$4',
});

const Subtitle = styled('div', {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const DescriptionCollapse: React.FC<DescriptionCollapseProps> = ({
  description,
}) => {
  return (
    <Collapse
      showArrow={Boolean(description.length)}
      expanded={false}
      title="Описание"
      disabled={!Boolean(description.length)}
      subtitle={<Subtitle>{description || 'Описание отсутствует'}</Subtitle>}
    >
      <Description>{description}</Description>
    </Collapse>
  );
};

export default DescriptionCollapse;
