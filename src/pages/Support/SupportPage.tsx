import { Link, Text } from '@nextui-org/react';
import React from 'react';

const SupportPage = () => {
  return (
    <>
      <Text h1>Поддержка</Text>
      <Text>
        Если вы столкнулись с проблемой или у вас есть предложение по улучшению
        сервиса — пишите на почту{'  '}
        <Link css={{ fontSize: '$lg' }} href="mailto:grenka7777777@gmail.com">
          grenka7777777@gmail.com
        </Link>
      </Text>
    </>
  );
};

export default SupportPage;
