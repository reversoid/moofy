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

  protected getPaginatedData<
    T extends
      | { created_at: Date; updated_at?: Date }
      | { created_at?: Date; updated_at: Date },
  >(
    entities: T[],
    limit: number,
    by: 'created_at' | 'updated_at',
  ): PaginatedData<T> {
    let nextKey: string | null = null;

    if (entities.length > limit) {
      const lastEntity = entities.at(-1)!;
      const fieldValue = lastEntity[by];
      nextKey = this.createNextKey(Number(fieldValue));
    }

    return { items: entities.slice(0, limit), nextKey };
  }
}
