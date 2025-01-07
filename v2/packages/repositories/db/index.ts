import { Pool } from "pg";
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

export * from "./tables";

export interface Database {
  users: UsersTable;
  collections: CollectionsTable;
  reviews: ReviewsTable;
  films: FilmsTable;
  sessions: SessionsTable;
  favoriteCollections: FavoriteCollectionsTable;
  subscriptions: SubscriptionsTable;
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
  log: ["query", "error"],
  plugins: [new CamelCasePlugin()],
});

export type Db = Kysely<Database>;
