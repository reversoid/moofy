export const getFileExtension = (file: File) => file.name.toLowerCase().split('.').at(-1) ?? '';

export const getFileSizeInMb = (file: File) => {
  return file.size / 1024 ** 2;
};

export const MAX_IMAGE_UPLOAD_SIZE_MB = 10;

export const SUPPORTED_IMAGE_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp', 'heif'];
