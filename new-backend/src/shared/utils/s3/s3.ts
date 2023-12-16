import EasyYandexS3 from 'easy-yandex-s3';

let s3: EasyYandexS3 | null = null;

export type S3Options = ConstructorParameters<typeof EasyYandexS3>[0];

export const setupS3 = (options: S3Options) => {
  s3 = new EasyYandexS3(options);
};

export const getS3 = () => {
  if (!s3) {
    throw new Error('S3 is not created');
  }
  return s3;
};

export const supportedImageFormats = ['jpg', 'png', 'jpeg', 'webp', 'heif'];

/** 10mb */
export const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024;

/** 100kb */
export const MAX_COMPRESSED_FILE_SIZE = 100 * 1024;
