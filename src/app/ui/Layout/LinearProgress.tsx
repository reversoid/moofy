import { LinearProgress as Progress } from '@mui/material';
import { FC } from 'react';

export interface LinearProgressProps {
  loading: boolean;
}

const LinearProgress: FC<LinearProgressProps> = ({ loading }) => {
  return (
    loading ? (
      <Progress
        sx={{
          '&.MuiLinearProgress-root': {
            background: 'transparent',
          },
          '& .MuiLinearProgress-bar': {
            background: '#ffd131',
          },
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 202,
        }}
      />
    ) : null
  );
};

export default LinearProgress;
