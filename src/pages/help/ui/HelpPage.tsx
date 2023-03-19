import { Link, Text } from '@nextui-org/react';

const HelpPage = () => {
  return (
    <>
      <Text h1>Помочь проекту</Text>
      <Text h3 css={{ mb: '$10' }}>
        Спасибо, что зашли сюда!
      </Text>
      <Text>Если вы желаете поддержать проект материально:</Text>
      <Text
        css={{
          textGradient: '45deg, $blue600 -20%, $pink600 50%',
          fontSize: '$5xl',
          fontWeight: '$bold',
          lineHeight: '100%',
          mb: '$12',
        }}
      >
        4377727813553125
      </Text>
      <Text>
        Если вы хотите предложить свою помощь по развитию продукта, то пишите на
        почту{' '}
        <Link css={{ fontSize: '$lg' }} href="mailto:grenka7777777@gmail.com">
          grenka7777777@gmail.com
        </Link>
        {' '}
        или Telegram{' '}
        <Link css={{ fontSize: '$lg' }} href="https://t.me/xoxo_gosha" target="_blank" rel="noopener noreferrer">
          @xoxo_gosha
        </Link>
      </Text>
    </>
  );
};

export default HelpPage;
