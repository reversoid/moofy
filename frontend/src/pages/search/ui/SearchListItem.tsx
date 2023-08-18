import { colorHash } from '@/entities/List/ui/List/ListBackground';
import {
  Img,
  ImgPlaceholder,
  CardWithContent,
} from '@/shared/ui/card-with-content/CardWithContent';
import { List } from '@/shared/api/types/list.type';
import { Link } from '@/shared/ui/Link/Link';
import { Text } from '@nextui-org/react';
import { FC } from 'react';

export interface SearchListItemProps {
  list: List;
}

const Image: FC<{ url?: string; valueToHash: string }> = ({
  url,
  valueToHash,
}) => {
  return url ? (
    <Img src={url} largerOnXs />
  ) : (
    <ImgPlaceholder
      css={{
        backgroundColor: colorHash.hex(valueToHash),
        '@xsMax': {
          mx: 'auto',
        },
      }}
      largerOnXs
    />
  );
};

const Creator: FC<{ username: string; id: number }> = ({ id, username }) => {
  return (
    <Text as={'p'} css={{ mt: '$2', color: '$textLight', marginTop: 'auto' }}>
      Создатель{' '}
      <Link
        css={{ fontWeight: '$medium', display: 'inline' }}
        to={`/profile/${id}`}
      >
        {username}
      </Link>
    </Text>
  );
};

export const SearchListItem: FC<SearchListItemProps> = ({ list }) => {
  return (
    <CardWithContent
      title={list.name}
      description={list.description}
      link={`/list/${list.id}`}
      image={<Image valueToHash={`${list.id}`} url={list.image_url} />}
      bottomContent={
        <Creator id={list.user.id} username={list.user.username} />
      }
    />
  );
};
