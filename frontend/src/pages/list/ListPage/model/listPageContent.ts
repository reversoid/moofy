import { logoutFx } from '@/features/auth/model/logout';
import { combine, createEvent, createStore } from 'effector';
import { $favoriteLists } from '../../../../features/list/_model/favoriteLists';
import { updateList } from './updateList';
import { ListPageContent } from '../lib/hooks/useListPage';
import { addReview } from './addReview';

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

$_listPageContent.on(addReview, (state, payload) => {
  if (!state || state.list.id !== payload.list.id) {
    return state;
  }

  return {
    ...state,
    reviews: [payload.review, ...state.reviews],
    list: payload.list,
  };
});

$_listPageContent.on(logoutFx.doneData, () => null);

/** Provides reactive list page info */
export const $singleListPage = combine([$_listPageContent, $favoriteLists]).map(
  ([listData, favs]) => {    
    if (!listData) {
      return undefined;
    }
    const listId = listData.list.id;
    const isFaved = listId in favs ? favs[listId] : undefined;

    const newIsFaved =
      isFaved !== undefined ? isFaved : listData.additionalInfo.isFavorite;

    const result: ListPageContent = {
      ...listData,
      additionalInfo: {
        ...listData.additionalInfo,
        isFavorite: newIsFaved,
      },
    };
    return result;
  },
);
