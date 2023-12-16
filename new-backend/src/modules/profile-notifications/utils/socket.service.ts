import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';

@Injectable()
export class SocketService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async saveUserSocketID(userId: number, socketId: string) {
    const key = this.getRedisKey(userId);
    await this.redis.sadd(key, socketId);
  }

  async removeUserSocketID(userId: number, socketId: string) {
    const key = this.getRedisKey(userId);
    await this.redis.srem(key, socketId);
  }

  async getUserSocketIDs(userId: number): Promise<string[]> {
    const key = this.getRedisKey(userId);
    return this.redis.smembers(key);
  }

  async clearAllSocketIds() {
    const keys = await this.findKeys(this.getRedisKey('*'));
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }

  private getRedisKey(userId: number | string) {
    return `user:${userId}:sockets`;
  }

  private async findKeys(pattern: string) {
    let cursor = '0';
    const keys: string[] = [];

    do {
      const [newCursor, elements] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = newCursor;
      keys.push(...elements);
    } while (cursor !== '0');

    return keys;
  }
}
