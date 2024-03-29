import { MultipartFile } from '@fastify/multipart';
import { Injectable } from '@nestjs/common';

import { WrongImageFormatException } from '../exceptions/wrong-image-format.exception';
import { TooLargeImageException } from '../exceptions/too-large-image.exception';
import * as sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { ImageLoadException } from '../exceptions/image-load.exception';
import {
  ALLOWED_IMAGE_RESOURCES,
  MAX_COMPRESSED_FILE_SIZE,
  MAX_INPUT_FILE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
} from './utils';
import { getS3 } from 'src/shared/utils/s3/s3';

const resourceToRouteMap: Record<ALLOWED_IMAGE_RESOURCES, string> = {
  collection: 'list-images',
  profile: 'profile-images',
};

@Injectable()
export class ImageService {
  async uploadImage(
    file: MultipartFile,
    resource: keyof typeof ALLOWED_IMAGE_RESOURCES,
  ): Promise<{ link: string }> {
    this.validateImageFormat(file.filename);

    const buffer = await file.toBuffer();

    this.validateRawSize(buffer.byteLength);

    const compressedImage = await sharp(buffer)
      .webp({ quality: 75 })
      .resize({ width: 600, height: 600, fit: 'cover' })
      .toBuffer();

    this.validateCompressedSize(compressedImage.byteLength);

    const s3 = getS3();

    const response = (await s3.Upload(
      { buffer: compressedImage },
      `/${resourceToRouteMap[resource]}/`,
    )) as ManagedUpload.SendData | false;

    if (!response) {
      throw new ImageLoadException();
    }

    return { link: response.Location };
  }

  private validateImageFormat(filename: string) {
    if (
      !SUPPORTED_IMAGE_FORMATS.includes(
        filename.toLocaleLowerCase().split('.').at(-1)!,
      )
    ) {
      throw new WrongImageFormatException();
    }
  }

  private validateRawSize(byteLength: number) {
    if (byteLength > MAX_INPUT_FILE_SIZE) {
      throw new TooLargeImageException();
    }
  }

  private validateCompressedSize(byteLength: number) {
    if (byteLength > MAX_COMPRESSED_FILE_SIZE) {
      throw new TooLargeImageException();
    }
  }
}
