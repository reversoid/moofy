import { Generated } from "kysely";

export interface FilmsTable {
  id: string;
  name: string;
  year: number;
  type: "FILM" | "TV_SERIES" | "TV_SHOW" | "MINI_SERIES" | "VIDEO";
  filmLength: string;
  genres: string[];
  posterPreviewUrl: string;
  posterUrl: string;
  createdAt: Generated<Date>;
  updatedAt: Date;
}
