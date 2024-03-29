import { Module } from '@nestjs/common';
import { ImageService } from './service/image.service';
import { ImageController } from './controller/image.controller';
import { ImageReuseService } from './service/image-reuse.service';

@Module({
  providers: [ImageService, ImageReuseService],
  controllers: [ImageController],
})
export class ImageModule {}
