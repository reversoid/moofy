import { $list, getList } from '@/models/singleList';
import { Image, Text } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function ListPage() {
  const { id } = useParams();
  const getListWithContent = useEvent(getList);
  const listWithContent = useStore($list);

  useEffect(() => {
    getListWithContent(Number(id));
  }, []);

  return (
    <>
      <Text h1>{listWithContent?.list.name}</Text>
      <Text as={'p'}>Описание {listWithContent?.list.description}</Text>
      <Text as={'p'}>Обновлен {listWithContent?.list.updated_at}</Text>
      <Text as={'p'}>Публичный список? {String(listWithContent?.list.is_public)}</Text>
      {listWithContent?.reviews.items.map(review => (
        <>
          
          <Text>Описание {review.description}</Text>
          <Text>Теги {String(review.tags)}</Text>
          <Text>Оценка {String(review.score)}</Text>
          <div>
            <Image src={review.film.posterPreviewUrl} width={100} height={100} objectFit='contain'/>
            <Text h4>{review.film.name}</Text>
            <Text>Год{review.film.year}</Text>            
          </div>
        </>
      ))}
    </>
  );
}

export default ListPage;
