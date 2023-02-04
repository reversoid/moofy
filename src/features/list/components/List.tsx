import { Card, Row, styled, Text } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import ColorHash from 'color-hash';
import add from './img/add.svg';

const colorHash = new ColorHash();

const Background = styled('div', {
  height: 140,
  backgroundSize: '30%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
});

const StyledLink = styled(Link, {
  display: 'block',
  width: '100%',
});

const CardBackground = ({ strToHash }: { strToHash: string }) => {
  return <Background css={{ bgColor: colorHash.hex(strToHash) }} />;
};

export interface ListProps {
  /** Used for hashing color. If not specified, add icon will be shown */
  id?: number;
  link: string;
  text: string;
}

const List = ({ id, link, text }: ListProps) => {
  return (
    <StyledLink to={link}>
      <Card isPressable css={{ p: 0 }}>
        <Card.Body css={{ p: 0 }}>
          {id === undefined ? (
            <Background
              css={{
                backgroundImage: `url(${add});`,
                backgroundColor: '#f1d302',
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
          </Row>
        </Card.Footer>
      </Card>
    </StyledLink>
  );
};

export default List;
