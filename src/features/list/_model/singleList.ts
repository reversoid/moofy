import { List } from "@/shared/api/types/list.type";
import { Review } from "@/shared/api/types/review.type";
import { IterableResponse } from "@/shared/api/types/shared";
import { createStore } from "effector";
import { getListFx, getMoreReviewsFx } from "../get-list";
import { updateListFx } from "../update-list";
import { updateReviewFx } from "@/features/review/update-review";
import { deleteReviewById, updateReviewInList } from "../_utils";
import { deleteReviewFx } from "@/features/review/delete-review";
import { createReviewFx } from "@/features/review/create-review";
import { addToFavoritesFx, removeFromFavoritesFx } from "../favorite-lists";
import { logoutFx } from "@/features/auth/model/logout";

export type SingleListStore = {
  reviews: IterableResponse<Review>;
  list: List;
  additionalInfo: {
    isFavorite: boolean;
  };
} | null;

export const $singleList = createStore<SingleListStore | null>(null);

$singleList.on(getListFx.doneData, (state, payload) => payload);
$singleList.on(updateListFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return { ...state, list: payload };
});
$singleList.on(getMoreReviewsFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return {
    ...state,
    reviews: {
      nextKey: payload.nextKey,
      items: [...state.reviews.items, ...payload.items],
    },
  };
});
$singleList.on(updateReviewFx.doneData, (state, { review, list }) => {
  if (!state) {
    return state;
  }

  return {
    ...state,
    reviews: {
      nextKey: state.reviews.nextKey,
      items: updateReviewInList(state.reviews.items, review),
    },
    list,
  };
});
$singleList.on(deleteReviewFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return {
    ...state,
    reviews: {
      nextKey: state.reviews.nextKey,
      items: deleteReviewById(state.reviews.items, payload.reviewId),
    },
    list: payload.list,
  };
});

$singleList.on(createReviewFx.doneData, (state, { list, review }) => {
  if (!state) {
    return state;
  }
  if (state.list.id !== list.id) {
    return state;
  }

  return {
    ...state,
    list: list,
    reviews: {
      items: [review, ...state.reviews.items],
      nextKey: state.reviews.nextKey,
    },
  };
});

$singleList.on(addToFavoritesFx.doneData, (state, payload) => {
  if (!state || state.list.id !== payload.list.id) {
    return state;
  }

  return {
    ...state,
    additionalInfo: {
      isFavorite: true,
    },
  };
});

$singleList.on(removeFromFavoritesFx.doneData, (state) => {
  if (!state) {
    return state;
  }

  return {
    ...state,
    additionalInfo: {
      isFavorite: false,
    },
  };
});

$singleList.on(logoutFx.doneData, () => null)