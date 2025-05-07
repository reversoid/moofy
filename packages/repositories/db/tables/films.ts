import { Generated } from "kysely";

export interface FilmsTable {
  id: Generated<number>;
  kinopoiskId: string;
  name: string;
  year: number;
  type: "FILM" | "TV_SERIES" | "TV_SHOW" | "MINI_SERIES" | "VIDEO";
  filmLength: number | null;
  genres: string[];
  posterPreviewUrl: string;
  posterUrl: string;
  createdAt: Generated<Date>;
  updatedAt: Date;
  searchDocument: unknown;
}
