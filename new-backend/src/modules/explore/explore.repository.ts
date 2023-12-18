import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Collection, collectionSchema } from '../collection/models/collection';

@Injectable()
export class ExploreRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getUnseenCollectionsFromFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = this.parseNextKey(nextKey);
    const dateKey = key && new Date(key);

    const result = (await this.prismaService.$queryRaw`
        SELECT
          l.id as collection_id,
          l.created_at as collection_created_at,
          l.description as collection_description,
          l.is_public as collection_is_public,
          l.name as collection_name,
          l.updated_at as collection_updated_at,

          u.id as user_id,
          u.created_at as user_created_at,
          u.description as user_description,
          u.image_url as user_image_url,
          u.username as user_username
        FROM list l
        JOIN users u ON l.user_id = u.id
        WHERE l.updated_at > COALESCE((
            SELECT MAX(lv.created_at)
            FROM list_view lv
            WHERE lv.list_id = l.id AND lv.user_id = ${userId}
        ), '1900-01-01')
        AND l.is_public = TRUE
        AND l.deleted_at IS NULL
        AND u.deleted_at IS NULL
        AND l.updated_at <= COALESCE(${dateKey}, NOW())
        ORDER BY l.updated_at DESC
        LIMIT ${limit + 1};
    `) as any[];

    const collections = this.parseRawCollections(result);

    return super.getPaginatedData(collections, limit, 'updatedAt');
  }

  async getLatestUpdatedCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = this.parseNextKey(nextKey);
    const dateKey = key ? new Date(key) : null;

    const result = (await this.prismaService.$queryRaw`
      SELECT
        l.id as collection_id,
        l.created_at as collection_created_at,
        l.description as collection_description,
        l.is_public as collection_is_public,
        l.name as collection_name,
        l.updated_at as collection_updated_at,
        u.id as user_id,
        u.created_at as user_created_at,
        u.description as user_description,
        u.image_url as user_image_url,
        u.username as user_username
      FROM list l
      JOIN users u ON l.user_id = u.id
      JOIN subscription s ON u.id = s.followed_id
      WHERE s.follower_id = ${userId}
      AND (
          SELECT COUNT(*)
          FROM review r
          WHERE r.list_id = l.id AND r.deleted_at IS NULL
      ) > 0
      AND l.is_public = TRUE
      AND l.deleted_at IS NULL
      AND u.deleted_at IS NULL
      AND l.updated_at <= COALESCE(${dateKey}, NOW())
      ORDER BY l.updated_at DESC
      LIMIT ${limit + 1};
    `) as any[];

    const collections = this.parseRawCollections(result);

    return super.getPaginatedData(collections, limit, 'updatedAt');
  }

  private parseRawCollections(rawData: any[]): Collection[] {
    return rawData.map<Collection>((data) =>
      collectionSchema.parse({
        id: data.collection_id,
        createdAt: data.collection_created_at,
        description: data.collection_description,
        isPublic: data.collection_is_public,
        name: data.collection_name,
        updatedAt: data.collection_updated_at,
        user: {
          id: data.user_id,
          createdAt: data.user_created_at,
          description: data.user_description,
          imageUrl: data.user_image_url,
          username: data.user_username,
        },
      } satisfies Collection),
    );
  }

  async getCollectionsUpdatesAmount(userId: User['id']): Promise<number> {
    const result = (await this.prismaService.$queryRaw`
        SELECT
          COUNT(l.*) as count
        FROM list l
        JOIN users u ON l.user_id = u.id
        WHERE l.updated_at > COALESCE((
            SELECT MAX(lv.created_at)
            FROM list_view lv
            WHERE lv.list_id = l.id AND lv.user_id = ${userId}
        ), '1900-01-01')
        AND l.is_public = TRUE
        AND l.deleted_at IS NULL
        AND u.deleted_at IS NULL
    `) as [{ count: bigint }];

    return Number(result[0].count);
  }
}
