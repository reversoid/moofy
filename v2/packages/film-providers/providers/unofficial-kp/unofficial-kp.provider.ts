import { Film, FilmType } from "@repo/core/entities";
import { IFilmProvider } from "@repo/core/film-providers";
import config from "@repo/config";
import ky from "ky";
import { ApiKeyRotator } from "../../utils/api-key-rotator.ts";
import { filmDtoSchema, filmsSearchResponseSchema } from "./dto.ts";

export class UnofficialKpProvider implements IFilmProvider {
  private apiKeyRotator = new ApiKeyRotator(config.UNOFFICIAL_KP_API_KEYS);

  async searchFilmsByName(name: string): Promise<Film[]> {
    const url = `${config.UNOFFICIAL_KP_URL}/v2.1/films/search-by-keyword`;

    const response = await ky.get(url, {
      headers: { "X-API-KEY": this.apiKeyRotator.getCurrentKey() },
      searchParams: {
        keyword: name,
      },
    });

    const data = await response.json();
    const parsedData = filmsSearchResponseSchema.parse(data);

    return parsedData.films.map(
      (f) =>
        new Film({
          // TODO do not link id to kpId
          // TODO learn more about id: can kp_id be undefined? Or films can have different schemas?
          id: String(f.kinopoiskId ?? f.filmId),
          filmLength: f.filmLength,
          genres: f.genres.map((g) => g.genre),
          name: f.nameRu,
          posterPreviewUrl: f.posterUrlPreview,
          posterUrl: f.posterUrl,
          type: FilmType[f.type],
          year: f.year,
        })
    );
  }

  async getFilmByKpId(id: string): Promise<Film | null> {
    const url = `${config.UNOFFICIAL_KP_URL}/v2.2/films/${id}`;

    const response = await ky.get(url, {
      headers: { "X-API-KEY": this.apiKeyRotator.getCurrentKey() },
    });

    // TODO check for 404
    const data = await response.json();
    const parsedData = filmDtoSchema.parse(data);

    return new Film({
      id: String(parsedData.kinopoiskId ?? parsedData.filmId),
      filmLength: parsedData.filmLength,
      genres: parsedData.genres.map((g) => g.genre),
      name: parsedData.nameRu,
      posterPreviewUrl: parsedData.posterUrlPreview,
      posterUrl: parsedData.posterUrl,
      type: FilmType[parsedData.type],
      year: parsedData.year,
    });
  }
}
