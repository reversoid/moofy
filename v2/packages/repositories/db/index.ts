import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import config from "@repo/config";
import {
  CollectionsTable,
  FilmsTable,
  ReviewsTable,
  UsersTable,
} from "./tables";

export * from "./tables";

export interface Database {
  users: UsersTable;
  collections: CollectionsTable;
  reviews: ReviewsTable;
  films: FilmsTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.PG_DB,
    host: config.PG_HOST,
    user: config.PG_USER,
    port: config.PG_PORT,
    max: config.PG_MAX_CONNECTIONS,
    password: config.PG_PASSWORD,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

export type Db = Kysely<Database>;
