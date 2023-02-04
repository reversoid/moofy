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
  link: string;
  text: string;
  /** If url is not specified will fallback with create icon */
  imageUrl?: string;
}

const List = ({ imageUrl, link, text }: ListProps) => {
  return (
    <StyledLink to={link}>
      <Card isPressable css={{ p: 0 }}>
        <Card.Body css={{ p: 0 }}>
          <CardBackground strToHash={text} />
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
