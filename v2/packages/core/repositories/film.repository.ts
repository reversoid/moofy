import { Film } from "../entities/film";
import { IBaseRepository } from "./base.repository";

export interface FilmRepository extends IBaseRepository<Film> {}
