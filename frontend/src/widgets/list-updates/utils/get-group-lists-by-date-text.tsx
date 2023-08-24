import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { getDateText } from './get-date-text';

export interface GroupedLists {
  dateText: string;
  lists: ListWithAdditionalInfo[];
}

export const getGroupListsByDateText = (lists: ListWithAdditionalInfo[]) => {
  return lists.reduce<GroupedLists[]>((groupedLists, list) => {
    const dateText = getDateText(new Date(list.list.updated_at));
    const prevDateText = groupedLists.at(-1)?.dateText;

    if (prevDateText === dateText) {
      const group = groupedLists.at(-1) as GroupedLists;

      group.lists.push(list);
    } else {
      groupedLists.push({ dateText, lists: [list] });
    }

    return groupedLists;
  }, []);
};
