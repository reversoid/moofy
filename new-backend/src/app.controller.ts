import { Controller, Get } from '@nestjs/common';
import { z } from 'zod';
import { zodToOpenAPI } from 'nestjs-zod';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('internal')
@ApiTags('Internal')
export class AppController {
  @Get('health')
  @ApiOkResponse({ schema: zodToOpenAPI(z.object({ ok: z.boolean() })) })
  async health() {
    return { ok: true };
  }
}
