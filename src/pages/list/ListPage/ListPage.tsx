import { Text } from '@nextui-org/react';
import React from 'react';
import { useParams } from 'react-router-dom';

function ListPage() {
  const { id } = useParams()

  return (
    <>
      <Text h1></Text>
    </>
  );
}

export default ListPage;
