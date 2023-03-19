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
  additionalElement?: JSX.Element;
  formId: string;
}

export const SubmitContainer: FC<SubmitContainerProps> = ({
  buttonDisabled,
  buttonLoading,
  buttonText,
  additionalElement,
  formId
}) => {
  return (
    <Container>
      <Button
        color={'gradient'}
        type="submit"
        form={formId}
        css={{ '@xsMin': { width: 'max-content !important' } }}
        size="lg"
        disabled={buttonDisabled}
      >
        {buttonLoading ? (
          <Loading size="lg" type="points" color="white" />
        ) : (
          buttonText
        )}
      </Button>
      {additionalElement}
    </Container>
  );
};
