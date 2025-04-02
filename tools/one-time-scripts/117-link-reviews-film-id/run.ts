import { db } from "@repo/repositories/db";

async function linkReviewsWithFilms() {
  const reviews = await db
    .selectFrom("reviews")
    .select(["id", "filmKinopoiskId"])
    .execute();

  const films = await db
    .selectFrom("films")
    .select(["id", "kinopoiskId"])
    .where(
      "kinopoiskId",
      "in",
      reviews.map((r) => r.filmKinopoiskId)
    )
    .execute();

  const filmMap = new Map(films.map((f) => [f.kinopoiskId, f.id]));

  for (const review of reviews) {
    const filmId = filmMap.get(review.filmKinopoiskId);
    if (!filmId) {
      continue;
    }
    await db
      .updateTable("reviews")
      .set({ filmId })
      .where("id", "=", review.id)
      .execute();
  }
}

await linkReviewsWithFilms();
