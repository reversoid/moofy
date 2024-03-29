export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'png', 'jpeg', 'webp', 'heif'];

/** 10mb */
export const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024;

/** 100kb */
export const MAX_COMPRESSED_FILE_SIZE = 100 * 1024;

export enum ALLOWED_IMAGE_RESOURCES {
  'profile' = 'profile',
  'collection' = 'collection',
}
