import { Film } from "../entities/film";
import { IBaseRepository } from "./base.repository";

export abstract class IFilmRepository extends IBaseRepository<Film> {}
