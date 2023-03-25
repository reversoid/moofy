import { filmService } from '@/features/search-films/api/film.service';
import { Film } from '@/shared/api/types/film.type';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';

export const getFilmsByName = createEvent<string>();

const getFilmsByNameFx = createEffect<string, { items: Film[] }>();
getFilmsByNameFx.use((name) => filmService.getFilmsByName(name));

export const $films = createStore<Film[] | null>(null);
$films.on(getFilmsByNameFx.doneData, (state, payload) => payload.items);

export const $getFilmsState = combine({
  loading: getFilmsByNameFx.pending,
  result: $films
})

sample({
  clock: getFilmsByName,
  target: getFilmsByNameFx,
});
