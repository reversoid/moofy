import { err, ok, Result } from "resulto";
import {
  BrokenImageError,
  ImageTooLargeError,
  WrongFileTypeError,
} from "./errors";
import { IImageService } from "./interface";
import easyYandexS3 from "easy-yandex-s3";
import config from "@repo/config";
import * as sharp from "sharp";

const EasyYandexS3 = (easyYandexS3 as any).default as typeof easyYandexS3;

const ALLOWED_EXTENSIONS = ["jpg", "png", "jpeg", "webp", "heic"];

const MAX_SIZE_IN_KB = 500 * 1024;

const ASPECT_RATIOS = {
  collection: [4, 3] as [number, number],
  user: [1, 1] as [number, number],
};

export class ImageService implements IImageService {
  s3 = new EasyYandexS3({
    auth: {
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    },
    Bucket: config.S3_BUCKET_NAME,
  });

  async uploadImage(
    file: File,
    resource: "collection" | "user"
  ): Promise<
    Result<
      { url: string },
      ImageTooLargeError | WrongFileTypeError | BrokenImageError
    >
  > {
    try {
      const checkFile = this.checkFileType(file);
      if (!checkFile) {
        return err(new WrongFileTypeError());
      }

      const convertedImageResult = await this.convertImage(
        file,
        ASPECT_RATIOS[resource]
      );

      if (convertedImageResult.isErr()) {
        return err(convertedImageResult.error);
      }

      const convertedImage = convertedImageResult.unwrap();

      const result = await this.s3.Upload({ buffer: convertedImage }, resource);
      if (!result || Array.isArray(result)) {
        throw new Error("Failed to upload image");
      }

      return ok({ url: result.Location });
    } catch (error) {
      if (error instanceof BrokenImageError) {
        return err(new BrokenImageError());
      }

      throw error;
    }
  }

  private async convertImage(
    file: File,
    aspectRatio: [number, number]
  ): Promise<Result<Buffer, ImageTooLargeError>> {
    const buffer = await file.arrayBuffer();
    const image = sharp.default(buffer);

    let leftAttempts = 3;
    let quality = 80;
    let convertedImage: Buffer;

    do {
      if (leftAttempts <= 0) {
        return err(new ImageTooLargeError());
      }
      leftAttempts--;

      convertedImage = await this.applySharpConvertImage(
        image,
        aspectRatio,
        quality
      );

      quality = Math.max(20, quality - 10);
    } while (
      !this.checkFileSize(new File([new Uint8Array(convertedImage)], file.name))
    );

    return ok(convertedImage);
  }

  private async applySharpConvertImage(
    image: sharp.Sharp,
    aspectRatio: [number, number],
    quality: number
  ): Promise<Buffer> {
    const metadata = await image.metadata();

    const width = Math.min(metadata.width ?? 0, 1280);
    const height = Math.min(metadata.height ?? 0, 1280);

    if (width === 0 || height === 0) {
      throw new BrokenImageError();
    }

    const { width: newWidth, height: newHeight } = this.getResizeOptions(
      width,
      aspectRatio
    );

    return image
      .resize({
        width: newWidth,
        height: newHeight,
        fit: "cover",
        position: "center",
      })
      .rotate()
      .webp({ quality })
      .toBuffer();
  }

  private getResizeOptions(
    width: number,
    aspectRatio: [number, number]
  ): { width: number; height: number } {
    const newHeight = Math.round((width / aspectRatio[0]) * aspectRatio[1]);

    return { width, height: newHeight };
  }

  private getFileExtension(file: File): string {
    return (file.name.split(".").pop() ?? "").toLowerCase();
  }

  private checkFileType(file: File): boolean {
    const extension = this.getFileExtension(file);

    return ALLOWED_EXTENSIONS.includes(extension);
  }

  private checkFileSize(file: File): boolean {
    return file.size <= MAX_SIZE_IN_KB;
  }
}
