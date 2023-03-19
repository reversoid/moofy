import { List } from "./list.type";
import { DateAsString } from "./shared";

export interface FavoriteList {
  id: number;
  list: List;
  createdAt: DateAsString;
}
