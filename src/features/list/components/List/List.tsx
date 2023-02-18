import add from '@/assets/img/add.svg';
import lock from '@/assets/img/lock.svg';
import { Card, Image, Row, styled, Text } from '@nextui-org/react';
import ColorHash from 'color-hash';
import { memo } from 'react';

const colorHash = new ColorHash();

const Background = styled('div', {
  height: 140,
  backgroundSize: '5rem',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
});

const CardBackground = ({ strToHash }: { strToHash: string }) => {
  return <Background css={{ bgColor: colorHash.hex(strToHash) }} />;
};

export interface ListProps {
  /** Used for hashing color. If not specified, add icon will be shown */
  id?: number;
  text: string;
  isPublic?: boolean;
}

const ListWrapper = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderRadius: '$lg',
  borderCollapse: 'separate',
  overflow: 'hidden',
  backgroundColor: '$gray50',
  transition: 'all 0.1s ease-in-out',
  '&:hover': {
    transform: 'translateY(-0.2rem)',
  },
  cursor: 'pointer',
  position: 'relative',
});

const ListBody = styled('div', {});

const List = ({ id, text, isPublic }: ListProps) => {
  return (
    <ListWrapper>
      <ListBody>
        {id === undefined ? (
          <Background
            css={{
              backgroundImage: `url(${add});`,
              backgroundColor: '#FFD131',
            }}
          />
        ) : (
          <CardBackground strToHash={String(id)} />
        )}
      </ListBody>
      <Card.Footer css={{ justifyItems: 'flex-start' }}>
        <Row wrap="nowrap" justify="space-between" align="center">
          <Text
            b
            css={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </Text>
          {isPublic === false && (
            <div>
              <Image src={lock} height={'1.125rem'} width={'1.125rem'}></Image>
            </div>
          )}
        </Row>
      </Card.Footer>
    </ListWrapper>
  );
};

export default memo(List);
