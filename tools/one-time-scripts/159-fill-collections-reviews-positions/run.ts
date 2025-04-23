import { db, kycely } from "@repo/repositories/db";

const fillPositions = async () => {
  const orderReviews = async () => {
    const allReviews = await db
      .selectFrom("reviews")
      .select("id")
      .orderBy("updatedAt asc")
      .execute();

    for (const { id } of allReviews) {
      await db
        .updateTable("reviews")
        .where("id", "=", id)
        .set(
          "reversePosition",
          kycely.sql<number>`nextval('reviews_reverse_position_seq')`
        )
        .execute();
    }
  };

  const orderCollections = async () => {
    const allCollections = await db
      .selectFrom("collections")
      .select("id")
      .orderBy("updatedAt asc")
      .execute();

    for (const { id } of allCollections) {
      await db
        .updateTable("collections")
        .where("id", "=", id)
        .set(
          "reversePosition",
          kycely.sql<number>`nextval('collections_reverse_position_seq')`
        )
        .execute();
    }
  };

  await Promise.all([orderCollections(), orderReviews()]);
};

await fillPositions();
