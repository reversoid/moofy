import React from 'react';
import crossRound from '@/assets/img/cross-round.svg';
import { Row, Image, Text } from '@nextui-org/react';

const DeleteModalContent = () => {
  return (
    <Row
      css={{
        gap: '$10',
        flexDirection: 'column',
      }}
    >
      <Image
        css={{
          width: '7rem',
          height: '7rem',
          objectFit: 'contain',
          flexShrink: 0,
          flexGrow: 0,
        }}
        src={crossRound}
      />

      <Row
        css={{
          flexDirection: 'column',
        }}
      >
        <Text b css={{ mb: '$2', textAlign: 'center', width: '100%' }}>
          Вы действительно хотите удалить список?
        </Text>
        <Text color="error" b css={{ textAlign: 'center', width: '100%' }}>
          Это приведет к удалению всех созданных в нем обзоров
        </Text>
      </Row>
    </Row>
  );
};

export default DeleteModalContent;
