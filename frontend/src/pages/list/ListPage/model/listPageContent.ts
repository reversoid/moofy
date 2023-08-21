import { combine, createEvent, createStore } from 'effector';
import { ListPageContent } from '../utils/hooks/useListPage';
import { $favoriteListsMap } from '@/entities/user-fav-lists';
import { updateReview } from '@/features/review/update-review';
import { createReview } from '@/features/review/create-review';
import { deleteReview } from '@/features/review/delete-review';
import { updateList } from '@/features/list/update-list';

export const setListPageContent = createEvent<{ data: ListPageContent }>();

/** Provides raw page info  */
const $_listPageContent = createStore<ListPageContent | null>(null);

$_listPageContent.on(setListPageContent, (state, { data }) => data);

$_listPageContent.on(updateList, (state, { list }) => {
  if (!state) {
    return state;
  }
  return { ...state, list };
});

$_listPageContent.on(updateReview, (state, { review, list }) => {
  if (!state) {
    return state;
  }

  const indexOfReview = state.reviews.findIndex(
    (item) => item.id === review.id,
  );
  if (indexOfReview === -1) {
    return state;
  }

  const reviews = [...state.reviews];
  reviews[indexOfReview] = { ...reviews[indexOfReview], ...review };

  return {
    ...state,
    reviews,
    list,
  };
});

$_listPageContent.on(createReview, (state, { list, review }) => {
  if (!state || state.list.id !== list.id) {
    return state;
  }

  return {
    ...state,
    reviews: [review, ...state.reviews],
    list: list,
  };
});

$_listPageContent.on(deleteReview, (state, { reviewId, list }) => {
  if (!state) {
    return state;
  }

  return {
    ...state,
    reviews: state.reviews.filter((r) => r.id !== reviewId),
    list,
  };
});

/** Provides reactive list page info */
export const $singleListPage = combine([
  $_listPageContent,
  $favoriteListsMap,
]).map(([listData, favs]) => {
  if (!listData) {
    return undefined;
  }

  const listId = listData.list.id;
  const isFaved = listId in favs ? favs[listId] : undefined;

  const newIsFaved = Boolean(
    isFaved !== undefined ? isFaved : listData?.additionalInfo?.isFavorite,
  );

  const result: ListPageContent = {
    ...listData,
    additionalInfo: listData.additionalInfo ? {
      ...listData.additionalInfo,
      isFavorite: newIsFaved,
    } : undefined,
  };
  return result;
});
