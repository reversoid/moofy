import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getRedisKey(userId: number) {
    return `user:${userId}:sockets`;
  }

  async saveUserSocketID(userId: number, socketId: string) {
    const key = this.getRedisKey(userId);
    await this.redis.sadd(key, socketId);
  }

  async removeUserSocketID(userId: number, socketId: string) {
    const key = this.getRedisKey(userId);
    await this.redis.srem(key, socketId);
  }

  async getUserSocketIDs(userId: number): Promise<string[] | null> {
    const key = this.getRedisKey(userId);
    return this.redis.smembers(key);
  }
}
