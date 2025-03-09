import { Result } from "resulto";
import {
  BrokenImageError,
  ImageTooLargeError,
  WrongFileTypeError,
} from "./errors";

export interface IImageService {
  uploadImage(
    file: File,
    resource: "collection" | "user"
  ): Promise<
    Result<
      { url: string },
      ImageTooLargeError | WrongFileTypeError | BrokenImageError
    >
  >;
}
