import { Film } from "../entities/film";
import { IBaseRepository } from "./base.repository";

export interface IFilmRepository extends IBaseRepository<Film> {}
