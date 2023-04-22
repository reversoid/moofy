import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import { formatDate } from '@/shared/lib/formatDate/formatDate';
import {
  Loading,
  Row,
  Text,
  Textarea,
  styled,
  useInput,
} from '@nextui-org/react';
import { useStore } from 'effector-react';
import {
  ComponentRef,
  FC,
  createRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  $editProfileState,
  editProfileDescription,
} from '../model/editProfileDescription';

interface ProfileInfoProps {
  description: string | null;
  createdAt: Date;
  isOwner: boolean;
}

const Description = styled('div', { mb: '$4' });

const AnimatedTextarea = styled(Textarea, {
  '& textarea': {
    transition:
      '0.12s margin ease-in-out, 0.12s background-color ease-in-out, 0.12s border-radius ease-in-out',
  },

  '& label': {
    cursor: 'default !important',
  },

  '& textarea:read-only, & textarea:disabled, & textarea': {
    color: '$text !important',
  },

  variants: {
    read: {
      true: {
        label: {
          background: 'transparent',
          borderRadius: 0,
        },
        textarea: {
          marginLeft: '0 !important',
          marginRight: '0 !important',
          cursor: 'default',
        },
      },
    },
  },
});

const ProfileInfo: FC<ProfileInfoProps> = ({
  createdAt,
  description,
  isOwner,
}) => {
  const [editMode, setEditMode] = useState(false);

  const inputRef = createRef<ComponentRef<typeof AnimatedTextarea>>();

  const { loading: editLoading, result } = useStore($editProfileState);

  useEffect(() => {
    // TODO can use hook for that?
    inputRef.current.value = description ?? '';
  }, [description]);

  useEffect(() => {
    if (!result) return;

    inputRef.current.value = result.description ?? '';
    setEditMode(false);
  }, [result]);

  return (
    <>
      <Description>
        <Row justify="space-between" align="center" css={{ mb: '$5' }}>
          <Text h3 css={{ margin: 0 }}>
            Описание
          </Text>
          {isOwner && (
            <>
              {editMode ? (
                <>
                  {editLoading ? (
                    <Loading size="sm" />
                  ) : (
                    <DoneButton
                      onClick={() => {
                        editProfileDescription({
                          newValue: inputRef.current.value,
                        });
                      }}
                    />
                  )}
                </>
              ) : (
                <EditButton onClick={() => setEditMode(true)} />
              )}
            </>
          )}
        </Row>

        {isOwner || description ? (
          <AnimatedTextarea
            width="100%"
            size="lg"
            placeholder="Ваше описание"
            minRows={2}
            read={!editMode}
            readOnly={!editMode || editLoading}
            disabled={!editMode}
            maxRows={Infinity}
            ref={inputRef}
          />
        ) : (
          <Text color="$neutral">Описание отсутствует</Text>
        )}
      </Description>

      <Row css={{ gap: '$3' }}>
        <Text size="lg" color="$neutral">
          Дата регистрации
        </Text>
        <Text size="lg">{formatDate(createdAt)}</Text>
      </Row>
    </>
  );
};

export default ProfileInfo;
