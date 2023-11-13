import { Body, Controller, Get } from '@nestjs/common';
import { HelloDto } from './dto';
import { z } from 'zod';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { ApiOkResponse } from '@nestjs/swagger';

const someResponse = z.object({ field: z.number() });

class K extends createZodDto(someResponse) {}

@Controller()
export class AppController {
  @Get('hello')
  @ApiOkResponse({ schema: zodToOpenAPI(someResponse) })
  async getHello(@Body() data: HelloDto) {
    console.log(data.someField);
    return 'aboba' as unknown as K;
  }
}
