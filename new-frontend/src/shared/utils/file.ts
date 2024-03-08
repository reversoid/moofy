export const getFileExtension = (file: File) => file.name.toLowerCase().split('.').at(-1) ?? '';

export const getFileSizeInMb = (file: File) => {
  return file.size / 1024 ** 2;
};
