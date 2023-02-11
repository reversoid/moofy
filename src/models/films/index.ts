import { filmService } from '@/features/films/film.service';
import { Film } from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const getFilmsByName = createEvent<string>();

export const getFilmsByNameFx = createEffect<string, { items: Film[] }>();
getFilmsByNameFx.use((name) => filmService.getFilmsByName(name));

export const $films = createStore<Film[] | null>(null);
$films.on(getFilmsByNameFx.doneData, (state, payload) => payload.items);

sample({
  clock: getFilmsByName,
  target: getFilmsByNameFx,
});
