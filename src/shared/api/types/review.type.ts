import { Film } from "./film.type";
import { List } from "./list.type";

export interface Review {
  id: number;
  film: Film;
  score: number;
  description: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}
