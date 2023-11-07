import { Review } from '@/shared/api/types/review.type';
import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

interface NoReviewsAlertProps {
  review: Review[] | undefined;
  refetch: () => void;
}

export const NoReviewsAlert: React.FC<NoReviewsAlertProps> = ({
  review,
  refetch,
}) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    if (review && review.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [refetch, review]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={error}
      autoHideDuration={6000}
      sx={{
        '& .MuiAlert-filledError': {
          background: '$error',
          fontFamily: 'inherit',
        },
        zIndex: '10000 !important',
      }}
    >
      <Alert
        severity="error"
        variant="filled"
        sx={{
          width: '100%',
          backgroundColor: 'error',
          justifyContent: 'center',
        }}
      >
        Нет обзоров в данной категории!
      </Alert>
    </Snackbar>
  );
};
