import { UploadImageResponse } from './responses/upload-image.response';

export interface IImageController {
  uploadFile(...args: any): Promise<UploadImageResponse>;
}
