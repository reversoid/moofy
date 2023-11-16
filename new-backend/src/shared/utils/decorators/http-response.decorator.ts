import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ZodSerializerDto, createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { ZodSchema } from 'zod';

/** Validates reponse and builds swagger based on provided schema */
export function HttpResponse(schema: ZodSchema): MethodDecorator {
  return applyDecorators(
    ZodSerializerDto(createZodDto(schema)),
    ApiOkResponse({ schema: zodToOpenAPI(schema) }),
  );
}
