type Primitive =
  | Array<unknown>
  | Date
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

type IsObject<T> = T extends object
  ? T extends Primitive
    ? false
    : true
  : false;

/** Builds type for selecting entity from prisma */
export type PrismaSelectEntity<T> = {
  [K in keyof T]: IsObject<T[K]> extends true
    ? { select: PrismaSelectEntity<T[K]> }
    : true;
};
