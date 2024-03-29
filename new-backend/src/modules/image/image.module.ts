import { Module } from '@nestjs/common';
import { ImageService } from './service/image.service';
import { ImageController } from './controller/image.controller';

@Module({
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
