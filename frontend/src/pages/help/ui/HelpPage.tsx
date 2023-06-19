import { Link, Text, styled } from '@nextui-org/react';

const Ul = styled('ul', {
  m: 0,
  mt: '$7',
});

const Li = styled('li', {
  m: 0,
});

const HelpPage = () => {
  return (
    <>
      <Text h1>Помочь проекту</Text>
      <Text h3 css={{ mb: '$10' }}>
        Спасибо, что зашли сюда!
      </Text>
      <Text
        css={{
          textGradient: '45deg, $blue600 -20%, $pink600 50%',
          fontSize: '$5xl',
          fontWeight: '$bold',
          lineHeight: '100%',
          mb: '$12',
          '@xsMax': {
            fontSize: '$3xl',
          },
        }}
      >
        4377727813553125
      </Text>
      <Text>
        Если вы хотите предложить свою помощь по развитию продукта — пишите
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

export default HelpPage;
