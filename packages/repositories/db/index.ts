import * as pg from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import config from "@repo/config";
import {
  CollectionsTable,
  FavoriteCollectionsTable,
  FilmsTable,
  ReviewsTable,
  RoadmapItemsTable,
  SubscriptionsTable,
  ToWatchCollectionsTable,
  UserPasskeysTable,
  UsersTable,
  WatchedReviewsTable,
} from "./tables";
import { SessionsTable } from "./tables/sessions";
import { CollectionLikesTable } from "./tables/collection-likes";
import { CollectionViewsTable } from "./tables/collection-view";
import { CollectionTagsTable } from "./tables/collection-tags";
import { ReviewTagsTable } from "./tables/review-tags";
import { UserPreferencesTable } from "./tables/user-preferences";
import { ChangelogsTable } from "./tables/changelogs";
import { UserChangelogViewsTable } from "./tables/user-changelog-views";
import { PersonalCollectionsTable } from "./tables/personal-collections";

const { Pool } = (pg as any).default as typeof pg;

export * from "./tables";

export interface Database {
  users: UsersTable;
  collections: CollectionsTable;
  reviews: ReviewsTable;
  films: FilmsTable;
  sessions: SessionsTable;
  favoriteCollections: FavoriteCollectionsTable;
  subscriptions: SubscriptionsTable;
  collectionLikes: CollectionLikesTable;
  collectionViews: CollectionViewsTable;
  collectionTags: CollectionTagsTable;
  reviewTags: ReviewTagsTable;
  userPreferences: UserPreferencesTable;
  changelogs: ChangelogsTable;
  userChangelogViews: UserChangelogViewsTable;
  personalCollections: PersonalCollectionsTable;
  roadmapItems: RoadmapItemsTable;
  toWatchCollections: ToWatchCollectionsTable;
  watchedReviews: WatchedReviewsTable;
  userPasskeys: UserPasskeysTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.PG_DATABASE,
    host: config.PG_HOST,
    user: config.PG_USER,
    port: config.PG_PORT,
    max: config.PG_MAX_CONNECTIONS,
    password: config.PG_PASSWORD,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  log: (event) => {
    if (config.ENV === "production") {
      return;
    }

    if (event.level === "query") {
      console.log("SQL QUERY:", event.query.sql);
      console.log("SQL PARAMS:", event.query.parameters);
    }

    if (event.level === "error") {
      console.log("SQL QUERY:", event.query.sql);
      console.log("SQL PARAMS:", event.query.parameters);
      console.log("SQL ERROR:", event.error);
    }
  },
  plugins: [new CamelCasePlugin()],
});

export type Db = Kysely<Database>;

export * as kycely from "kysely";
