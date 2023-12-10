import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppEnvironments } from 'src/config/global.config';
import { GlobalConfig } from 'src/modules/global/global.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(globalConfig: GlobalConfig) {
    super({ log: ['query', 'error', 'warn', 'info'], errorFormat: 'minimal' });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
