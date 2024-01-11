export interface Film {
  id: string;
  name: string;
  year: number;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];
  type: 'FILM' | 'TV_SERIES' | 'TV_SHOW' | 'MINI_SERIES' | 'VIDEO';
}

export interface Review {
  id: number;
  score: number | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  film: Film;
  isHidden: boolean;
}
