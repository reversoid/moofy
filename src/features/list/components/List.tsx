import { Card, Row, styled, Text } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const Plus = styled('div', {
  height: 140,
  background: 'red',
});

const StyledLink = styled(Link, {
  display: 'block',
  width: '100%',
});

export interface ListProps {
  link: string;
  text: string;
  /** If url is not specified will fallback with create icon */
  imageUrl?: string;
}

const CardImage = ({ url }: { url: string }) => {
  return (
    <Card.Image
      src={url}
      objectFit="cover"
      width="100%"
      height={140}
    />
  );
}

const List = ({ imageUrl, link, text }: ListProps) => {
  return (
    <StyledLink to={link}>
      <Card isPressable css={{ p: 0 }}>
        <Card.Body css={{ p: 0 }}>
          {imageUrl ? <CardImage url={imageUrl} /> : <Plus />}
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
