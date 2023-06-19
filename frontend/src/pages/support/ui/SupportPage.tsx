import { Link, Text, styled } from '@nextui-org/react';

const Ul = styled('ul', {
  m: 0,
  mt: '$8',
});

const Li = styled('li', {
  m: 0,
});

const SupportPage = () => {
  return (
    <>
      <Text h1>Поддержка</Text>
      <Text>
        Если вы столкнулись с проблемой или у вас есть предложение по улучшению
        сервиса — пишите:
      </Text>
      <Ul>
        <Li>
          <Link css={{ fontSize: '$xl' }} href="mailto:grenka7777777@gmail.com">
            grenka7777777@gmail.com
          </Link>
        </Li>
        <Li>
          <Link
            css={{ fontSize: '$xl' }}
            href="https://t.me/xoxo_gosha"
            target="_blank"
            rel="noopener noreferrer"
          >
            @xoxo_gosha
          </Link>
        </Li>
      </Ul>
    </>
  );
};

export default SupportPage;
