import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { createHash } from 'crypto';
import { Redis } from 'ioredis';

@Injectable()
export class ImageReuseService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private REDIS_KEY = 'uploaded-images';

  async getExistingFileLink(buffer: Buffer): Promise<string | null> {
    const hash = this.getFileHash(buffer);
    const link = await this.redis.hget(this.REDIS_KEY, hash);

    return link;
  }

  async addFileToReusableStorage(buffer: Buffer, link: string) {
    const hash = this.getFileHash(buffer);
    await this.redis.hset(this.REDIS_KEY, hash, link);
  }

  private getFileHash(buffer: Buffer) {
    return createHash('sha256').update(buffer).digest('hex');
  }
}
