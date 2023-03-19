import { styled } from "@nextui-org/react";

export const Listbox = styled('ul', {
  width: '100%',
  margin: 0,
  padding: 0,
  zIndex: 201,
  position: 'absolute',
  left: '0rem',
  listStyle: 'none',
  backgroundColor: '$gray50',
  overflow: 'auto',
  maxHeight: '15rem',
  color: '$gray900',
  '& li.Mui-focused': {
    cursor: 'pointer',
    backgroundColor: '$gray100',
  },
  '& li:active': {
    backgroundColor: '$gray100',
  },
  borderRadius: '1rem !important',
  scrollbarWidth: 0,
  overflowY: 'scroll',
  '-ms-overflow-style': 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const Li = styled('li', {
  height: '5rem',
  padding: '$3 $5',
  margin: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$5',
  background: '$gray50',
});

export const LiBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
});
