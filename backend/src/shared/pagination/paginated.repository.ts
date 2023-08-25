import {
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

/**Used because database saves time in microseconds, but in js we use milliseconds */
const increaseTimeByOneMs = (date: Date) => new Date(date.getTime() + 1);

/**This class provides features for paginating by created_at and updated_at DESC */
export class PaginatedRepository<
  T extends { updated_at?: Date; created_at?: Date },
> extends Repository<T> {
  /** If lower bound is not defined, we need to get all records */
  protected getCompareOperator(lowerBound?: Date): FindOperator<Date> {
    let compareOperator: FindOperator<Date>;
    if (lowerBound === undefined) {
      compareOperator = MoreThanOrEqual(new Date('1970-01-01 00:00:00'));
    } else {
      compareOperator = LessThanOrEqual(increaseTimeByOneMs(lowerBound));
    }
    return compareOperator;
  }

  /** Returns correct nextKey for pagination and items */
  protected processPagination<V = T>(
    items: V[],
    limit: number,
    by: 'created_at' | 'updated_at',
  ) {
    let nextKey: Date = null;
    if (items.length > limit) {
      nextKey = items.at(-1)[by];
      items = items.slice(0, -1);
    }
    return {
      nextKey,
      items,
    };
  }

  /** Returns operator and date to compare */
  protected getRAWDatesCompareString(lowerBound?: Date): {
    operator: string;
    date: string;
  } {
    if (lowerBound === undefined) {
      return {
        operator: '>=',
        date: `"${new Date('1970-01-01 00:00:00').toISOString()}"`,
      };
    } else {
      return {
        operator: '<=',
        date: `"${increaseTimeByOneMs(lowerBound).toISOString()}"`,
      };
    }
  }
}
