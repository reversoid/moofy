import {
  IFilmProvider,
  ProviderFilmDto,
  ProviderFilmType,
} from "@repo/core/film-providers";
import config from "@repo/config";
import ky from "ky";
import { ApiKeyRotator } from "../../utils/api-key-rotator";
import {
  searchFilmDtoSchema,
  filmsSearchResponseSchema,
  getFilmDtoSchema,
} from "./dto";

export class UnofficialKpProvider implements IFilmProvider {
  private apiKeyRotator = new ApiKeyRotator(config.UNOFFICIAL_KP_API_KEYS);

  async searchFilmsByName(
    name: string,
    limit: number = 10
  ): Promise<ProviderFilmDto[]> {
    const url = `${config.UNOFFICIAL_KP_URL}/v2.1/films/search-by-keyword`;

    const response = await ky.get(url, {
      headers: { "X-API-KEY": this.apiKeyRotator.getCurrentKey() },
      searchParams: {
        keyword: name,
      },
    });

    const data = await response.json();

    const parsedData = filmsSearchResponseSchema.parse(data);

    return parsedData.films
      .map((f) => searchFilmDtoSchema.safeParse(f))
      .filter((result) => result.success)
      .map((result) => result.data)
      .map((f) => ({
        kinopoiskId: String(f.filmId),
        filmLength: f.filmLength,
        genres: f.genres.map((g) => g.genre),
        name: (f.nameRu ?? f.nameEn) as string,
        posterPreviewUrl: f.posterUrlPreview,
        posterUrl: f.posterUrl,
        type: ProviderFilmType[f.type],
        year: f.year,
      }))
      .slice(0, limit);
  }

  async getFilmByKpId(id: string): Promise<ProviderFilmDto | null> {
    const url = `${config.UNOFFICIAL_KP_URL}/v2.2/films/${id}`;

    const response = await ky.get(url, {
      headers: { "X-API-KEY": this.apiKeyRotator.getCurrentKey() },
    });

    // TODO check for 404
    const data = await response.json();

    const parsedData = getFilmDtoSchema.parse(data);

    return {
      kinopoiskId: String(parsedData.kinopoiskId),
      filmLength: String(parsedData.filmLength ?? 0),
      genres: parsedData.genres.map((g) => g.genre),
      name: (parsedData.nameRu ?? parsedData.nameEn) as string,
      posterPreviewUrl: parsedData.posterUrlPreview,
      posterUrl: parsedData.posterUrl,
      type: ProviderFilmType[parsedData.type],
      year: parsedData.year,
    };
  }
}
