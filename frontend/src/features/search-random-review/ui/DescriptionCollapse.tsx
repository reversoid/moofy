import { Collapse, Text } from '@nextui-org/react';

interface DescriptionCollapseProps {
  description: string;
}

const DescriptionCollapse: React.FC<DescriptionCollapseProps> = ({
  description,
}) => {
  const makeSubtitle = (string: string) =>
    string.split(' ').slice(0, 3).join(' ') + '...';
  return (
    <Collapse
      showArrow={Boolean(description.length)}
      expanded={false}
      title="Описание"
      disabled={!Boolean(description.length)}
      subtitle={
        description.length ? makeSubtitle(description) : 'Описание отсутствует'
      }
      css={{
        '.nextui-collapse-title': {
          fontSize: '20px',
          minWidth: '250px',
        },
        '.nextui-c-lfcDHB': {
          padding: '.5rem 0 .6rem 0',
        },
        '.nextui-collapse-content': {
          padding: '0 0 .5rem',
        },
      }}
    >
      <Text
        css={{
          padding: description.length ? ' 0' : '',
          wordBreak: 'break-word',
          width: '100%',
          FontSize: '$md',
          '..nextui-c-lfcDHB-fBzxmJ-disabled-true': {
            minWidth: '270px',
          },
        }}
      >
        {description}
      </Text>
    </Collapse>
  );
};

export default DescriptionCollapse;
