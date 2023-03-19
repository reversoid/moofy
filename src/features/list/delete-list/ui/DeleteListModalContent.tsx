import crossRound from '@/shared/assets/img/cross-round.svg';
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
          width: '6rem',
          height: '6rem',
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
          Вы действительно хотите удалить коллекцию?
        </Text>
        <Text color="error" b css={{ textAlign: 'center', width: '100%' }}>
          Это приведет к удалению всех созданных в ней обзоров
        </Text>
      </Row>
    </Row>
  );
};

export default DeleteModalContent;
