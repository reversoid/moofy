import {
  Controller,
  ParseEnumPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { IImageController } from './image.controller.interface';
import { ImageService } from '../service/image.service';
import { NoImageProvidedException } from '../exceptions/no-image-provided.exception';
import { ALLOWED_IMAGE_RESOURCES } from '../service/utils';

@Controller('image')
export class ImageController implements IImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('')
  async uploadFile(
    @Request() request: FastifyRequest,
    @Query('resource', new ParseEnumPipe(ALLOWED_IMAGE_RESOURCES))
    resource: keyof typeof ALLOWED_IMAGE_RESOURCES,
  ) {
    const file = await request.file();
    if (file?.fieldname === 'image') {
      return this.imageService.uploadImage(file, resource);
    }

    throw new NoImageProvidedException();
  }
}
