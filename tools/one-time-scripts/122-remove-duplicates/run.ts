import { db } from "@repo/repositories/db";

const removeLikesDuplicates = async () => {
  const likes = await db
    .selectFrom("collectionLikes")
    .select(["collectionId", "userId", "id"])
    .orderBy("createdAt", "asc")
    .execute();

  type Key = `${string}-${string}`;
  type Id = number;

  const likesMap = new Map<Key, Id[]>();

  for (const like of likes) {
    const key = `${like.collectionId}-${like.userId}` as Key;

    if (!likesMap.has(key)) {
      likesMap.set(key, [like.id]);
    } else {
      likesMap.get(key)!.push(like.id);
    }
  }

  const idsToRemove = [];

  for (const ids of likesMap.values()) {
    if (ids.length === 1) {
      continue;
    }

    idsToRemove.push(...ids.slice(0, -1));
  }

  if (idsToRemove.length === 0) {
    return;
  }

  await db
    .deleteFrom("collectionLikes")
    .where("id", "in", idsToRemove)
    .execute();
};

const removeFollowersDuplicates = async () => {
  const subscriptions = await db
    .selectFrom("subscriptions")
    .select(["fromUserId", "toUserId", "id"])
    .orderBy("createdAt", "asc")
    .execute();

  type Key = `${string}-${string}`;
  type Id = number;

  const subscriptionsMap = new Map<Key, Id[]>();

  for (const sub of subscriptions) {
    const key = `${sub.fromUserId}-${sub.toUserId}` as Key;

    if (!subscriptionsMap.has(key)) {
      subscriptionsMap.set(key, [sub.id]);
    } else {
      subscriptionsMap.get(key)!.push(sub.id);
    }
  }

  const idsToRemove = [];

  for (const ids of subscriptionsMap.values()) {
    if (ids.length === 1) {
      continue;
    }

    idsToRemove.push(...ids.slice(0, -1));
  }

  if (idsToRemove.length === 0) {
    return;
  }

  await db.deleteFrom("subscriptions").where("id", "in", idsToRemove).execute();
};

const removeFavCollectionsDuplicates = async () => {
  const favCollections = await db
    .selectFrom("favoriteCollections")
    .select(["collectionId", "userId", "id"])
    .orderBy("createdAt", "asc")
    .execute();

  type Key = `${string}-${string}`;
  type Id = number;

  const favMap = new Map<Key, Id[]>();

  for (const fav of favCollections) {
    const key = `${fav.collectionId}-${fav.userId}` as Key;

    if (!favMap.has(key)) {
      favMap.set(key, [fav.id]);
    } else {
      favMap.get(key)!.push(fav.id);
    }
  }

  const idsToRemove = [];

  for (const ids of favMap.values()) {
    if (ids.length === 1) {
      continue;
    }

    idsToRemove.push(...ids.slice(0, -1));
  }

  if (idsToRemove.length === 0) {
    return;
  }

  await db
    .deleteFrom("favoriteCollections")
    .where("id", "in", idsToRemove)
    .execute();
};

const removeReviewsDuplicates = async () => {
  const reviews = await db
    .selectFrom("reviews")
    .select(["collectionId", "filmKinopoiskId", "id"])
    .orderBy("createdAt", "asc")
    .execute();

  type Key = `${string}-${string}`;
  type Id = number;

  const reviewsMap = new Map<Key, Id[]>();

  for (const review of reviews) {
    const key = `${review.collectionId}-${review.filmKinopoiskId}` as Key;

    if (!reviewsMap.has(key)) {
      reviewsMap.set(key, [review.id]);
    } else {
      reviewsMap.get(key)!.push(review.id);
    }
  }

  const idsToRemove = [];

  for (const ids of reviewsMap.values()) {
    if (ids.length === 1) {
      continue;
    }

    idsToRemove.push(...ids.slice(0, -1));
  }

  if (idsToRemove.length === 0) {
    return;
  }

  await db.deleteFrom("reviews").where("id", "in", idsToRemove).execute();
};

await Promise.all([
  removeLikesDuplicates(),
  removeFollowersDuplicates(),
  removeFavCollectionsDuplicates(),
  removeReviewsDuplicates(),
]);

await db.destroy();
