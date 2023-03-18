import { FavoriteList } from "@/shared/api/types/favoriteList.type";
import { IterableResponse } from "@/shared/api/types/shared";
import { createStore } from "effector";
import { getFavoriteListsFx } from "../favorite-lists/model/getFavoriteLists";
import { getMoreFavoritesFx, addToFavoritesFx, removeFromFavoritesFx } from "../favorite-lists/model";

export const $favoriteLists =
  createStore<IterableResponse<FavoriteList> | null>(null);

$favoriteLists.on(getFavoriteListsFx.doneData, (state, payload) => payload);
$favoriteLists.on(getMoreFavoritesFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return payload;
});
$favoriteLists.on(addToFavoritesFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return {
    ...state,
    items: [payload, ...state.items],
  };
});
$favoriteLists.on(removeFromFavoritesFx.doneData, (state, { listId }) => {
  if (!state) {
    return state;
  }
  const listIndex = state.items.findIndex((l) => l.list.id === listId);
  if (listIndex === -1) {
    return state;
  }
  return {
    ...state,
    items: state.items.splice(listIndex, 1),
  };
});
