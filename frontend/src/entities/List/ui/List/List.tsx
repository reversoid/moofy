import add from '@/shared/assets/img/add.svg';
import lock from '@/shared/assets/img/lock.svg';
import { CardBody, CardFooter } from '@/shared/ui/Card';
import { Card } from '@/shared/ui/Card/Card';
import { Card as _Card, Image, Row, Text } from '@nextui-org/react';
import { FC, memo } from 'react';
import { Background, ListBackground } from './ListBackground';

type OnProps = Pick<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onClick'
>;

export interface ListProps extends OnProps {
  /** Used for hashing color. If not specified, add icon will be shown */
  id?: number;
  text: string;
  isPublic?: boolean;
  imageUrl?: string
}

export const List: FC<ListProps> = memo(({ id, text, isPublic, onClick, imageUrl }) => {
  return (
    <Card
      isHoverable
      onClick={onClick}
      css={{ display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      <CardBody>
        {id === undefined ? (
          <Background
            css={{
              backgroundImage: `url(${add});`,
              backgroundColor: '#FFD131',
            }}
          />
        ) : (
          <ListBackground id={String(id)} imageUrl={imageUrl} />
        )}
      </CardBody>
      <CardFooter css={{ justifyItems: 'flex-start' }}>
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
      </CardFooter>
    </Card>
  );
});
