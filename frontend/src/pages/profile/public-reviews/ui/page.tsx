import { FC } from 'react';
import { usePublicReviews } from '../utils/use-public-reviews';
import { Text } from '@nextui-org/react';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { ReviewList } from '@/widgets/review-list';
import { Link } from '@/shared/ui/Link/Link';

export const PublicReviewsPage: FC = () => {
  const {
    data,
    isLoading,
    canLoadMore,
    isLoadingMore,
    loadMore,
    profileUsername,
    profileId,
  } = usePublicReviews();
  useLoadingBar(isLoading);

  return (
    <div>
      <Text h1>
        Обзоры{' '}
        <Link
          css={{ display: 'inline', ml: '0.25rem' }}
          to={`/profile/${profileId}`}
        >
          {profileUsername}
        </Link>
      </Text>
      {data && (
        <ReviewList
          isUserOwner={false}
          noReviewsText="Нет публичных обзоров"
          canLoadMore={canLoadMore}
          loadingMore={isLoadingMore}
          reviews={data?.map((d) => d.review)}
          loadMore={loadMore}
        />
      )}
    </div>
  );
};
