import Sqids from 'sqids';
import { PaginatedData } from './paginated-data';

export class PaginatedRepository {
  private sqids = new Sqids();

  private createNextKey(value: number): string {
    return this.sqids.encode([value])[0];
  }

  protected parseNextKey(key?: string | null): number | null {
    if (!key) {
      return null;
    }
    return this.sqids.decode(key).at(0) ?? null;
  }

  protected getPaginatedData<T extends { createdAt?: Date; updatedAt?: Date }>(
    entities: T[],
    limit: number,
    by: 'createdAt' | 'updatedAt',
  ): PaginatedData<T> {
    let nextKey: string | null = null;

    if (entities.length > limit) {
      const lastEntity = entities.at(-1)!;
      const fieldValue = lastEntity[by];
      nextKey = this.createNextKey(Number(fieldValue));
    }

    return { items: this.sliceItems(entities, limit), nextKey };
  }

  protected sliceItems<T>(items: T[], limit: number) {
    return items.slice(0, limit);
  }
}
