import { Card, Row, styled, Text } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import ColorHash from 'color-hash';

const colorHash = new ColorHash();

const Background = styled('div', {
  height: 140,
});

const StyledLink = styled(Link, {
  display: 'block',
  width: '100%',
});

const CardBackground = ({ strToHash }: { strToHash: string }) => {
  return <Background css={{ bgColor: colorHash.hex(strToHash) }} />;
};

export interface ListProps {
  /** Can be empty if component is used for list creation. Will display add icon then. */
  id?: number;
  link: string;
  text: string;
}

const List = ({ id, link, text }: ListProps) => {
  return (
    <StyledLink to={link}>
      <Card isPressable css={{ p: 0 }}>
        <Card.Body css={{ p: 0 }}>
          <CardBackground strToHash={String(id) ?? ''} />
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
