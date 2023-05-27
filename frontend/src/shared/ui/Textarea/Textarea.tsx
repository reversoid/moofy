import { Text, Textarea as _Textarea, styled } from '@nextui-org/react';
import { TextareaProps } from '@nextui-org/react/types/textarea';
import { forwardRef, memo, useEffect, useState } from 'react';

const TextAreaWrapper = styled('div', {
  position: 'relative',
});

const CountText = styled(Text, {
  position: 'absolute',
  top: 0,
  right: '$2',
});

interface TextAreaCountProps extends Partial<TextareaProps> {
  maxLength: number;
  /** Provide for correct count of initial value */
  initialValue?: string;
}
const Textarea = forwardRef<HTMLTextAreaElement, TextAreaCountProps>(
  (props, ref) => {
    const [length, setLength] = useState(
      (props.initialValue as string)?.length ??
        (props.value as string)?.length ??
        (props.defaultValue as string)?.length ??
        0,
    );

    useEffect(() => {
      if (props.initialValue) {
        setLength(props.initialValue.length);
      }
    }, [props.initialValue]);

    return (
      <TextAreaWrapper>
        <CountText color="$neutral">
          {length}/{props.maxLength}
        </CountText>
        <_Textarea
          ref={ref}
          {...{
            ...props,
            css: {
              width: '100%',
              ...props.css,
            },
            onChange(e) {
              setLength(e.target.value.length);
              props.onChange && props.onChange(e);
            },
          }}
        />
      </TextAreaWrapper>
    );
  },
);

export default memo(Textarea);
