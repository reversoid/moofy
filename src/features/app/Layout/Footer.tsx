import React, { memo } from 'react';
import { Wrapper } from './Layout';

function Footer() {
  return (
    <Wrapper lg css={{ pt: 0, pb: 0 }}>
      hello footer
    </Wrapper>
  );
}

export default memo(Footer);
