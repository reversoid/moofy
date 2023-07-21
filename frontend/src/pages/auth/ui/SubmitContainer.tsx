import { Button, Loading, styled } from '@nextui-org/react';
import React, { FC } from 'react';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '$8',
});

interface SubmitContainerProps {
  buttonLoading: boolean;
  buttonDisabled: boolean;
  buttonText: string;
  formId: string;
  /** Does not show that button is disabled but it is */
  buttonSilentlyDisabled?: boolean;
}

export const SubmitContainer: FC<SubmitContainerProps> = ({
  buttonDisabled,
  buttonLoading,
  buttonText,
  formId,
  buttonSilentlyDisabled,
}) => {
  return (
    <Container>
      <Button
        color={'gradient'}
        type="submit"
        form={formId}
        css={{
          '@xsMin': { width: 'max-content !important' },
          pointerEvents: buttonSilentlyDisabled ? 'none' : 'auto',
        }}
        size="lg"
        disabled={buttonDisabled}
        tabIndex={buttonDisabled ? -1 : 0}
      >
        {buttonLoading ? (
          <Loading size="lg" type="points" color="white" />
        ) : (
          buttonText
        )}
      </Button>
    </Container>
  );
};
