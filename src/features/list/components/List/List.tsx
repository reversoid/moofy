import { Card, Image, Row, styled, Text } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import ColorHash from 'color-hash';
import add from '@/assets/img/add.svg';
import lock from '@/assets/img/lock.svg';
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

const List = ({ id, text, isPublic }: ListProps) => {
  return (
    <Card isPressable isHoverable css={{ p: 0 }}>
      <Card.Body css={{ p: 0 }}>
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
      </Card.Body>
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
    </Card>
  );
};

export default memo(List);
