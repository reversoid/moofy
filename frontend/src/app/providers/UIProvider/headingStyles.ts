import { CSS } from '@nextui-org/react';

const h1Styles: CSS = {
  mb: '$10',
  '@mdMax': {
    fontSize: '$4xl',
    mb: '$9',
  },
  '@xsMax': {
    fontSize: '$3xl',
    mb: '$8',
  },
};

const h2Styles: CSS = {
  '@mdMax': {
    fontSize: '$3xl',
  },
  '@xsMax': {
    fontSize: '$2xl',
  },
};

const h3Styles: CSS = {
  '@mdMax': {
    fontSize: '$2xl',
  },
  '@xsMax': {
    fontSize: '$xl',
  },
};

export const HEADING_STYLES = {
  h1: h1Styles,
  h2: h2Styles,
  h3: h3Styles,
};
