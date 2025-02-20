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
