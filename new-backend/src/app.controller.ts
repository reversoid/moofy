import { Body, Controller, Post } from '@nestjs/common';
import { HelloDto } from './dto';
import { z } from 'zod';
import { ZodSerializerDto, createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { ApiOkResponse } from '@nestjs/swagger';

const someResponse = z.object({ field: z.number() });

class K extends createZodDto(someResponse) {}

@Controller()
export class AppController {
  @Post('hello')
  @ZodSerializerDto(K)
  @ApiOkResponse({ schema: zodToOpenAPI(someResponse) })
  async getHello(@Body() data: HelloDto) {
    console.log(data.someField);
    return 'aboba' as unknown as K;
  }
}
