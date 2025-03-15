import * as pg from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import config from "@repo/config";
import {
  CollectionsTable,
  FavoriteCollectionsTable,
  FilmsTable,
  ReviewsTable,
  SubscriptionsTable,
  UsersTable,
} from "./tables";
import { SessionsTable } from "./tables/sessions";
import { CollectionLikesTable } from "./tables/collection-likes";
import { CollectionViewsTable } from "./tables/collection-view";
import { CollectionTagsTable } from "./tables/collection-tags";
import { ReviewTagsTable } from "./tables/review-tags";

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
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }

    if (event.level === "error") {
      console.log(event.query.sql);
      console.log(event.query.parameters);
      console.log(event.error);
    }
  },
  plugins: [new CamelCasePlugin()],
});

export type Db = Kysely<Database>;
