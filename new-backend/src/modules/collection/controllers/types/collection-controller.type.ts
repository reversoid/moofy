import { AddToFavoriteResponse } from '../responses/add-favorite.response';
import { CreateCollectionResponse } from '../responses/create-collection.response';
import { DeleteCollectionResponse } from '../responses/delete-collection.response';
import { GetFullCollectionResponse } from '../responses/get-full-collection.response';
import { LikeCollectionResponse } from '../responses/like-collection.response';
import { RemoveFromFavoriteResponse } from '../responses/remove-favorite.response';
import { UnlikeCollectionResponse } from '../responses/unlike-collection.response';
import { UpdateCollectionResponse } from '../responses/update-collection.response';
import { UploadImageResponse } from '../responses/upload-image.response';

export interface ICollectionController {
  createCollection(...args: any): Promise<CreateCollectionResponse>;
  getFullCollection(...args: any): Promise<GetFullCollectionResponse>;
  uploadFile(): Promise<UploadImageResponse>;
  updateCollection(): Promise<UpdateCollectionResponse>;
  deleteCollection(...args: any): Promise<DeleteCollectionResponse>;
  likeCollection(...args: any): Promise<LikeCollectionResponse>;
  unlikeCollection(...args: any): Promise<UnlikeCollectionResponse>;
  addFavoriteCollection(...args: any): Promise<AddToFavoriteResponse>;
  deleteFavoriteCollection(...args: any): Promise<RemoveFromFavoriteResponse>;
  markCollectionAsViewed(...args: any): Promise<void>;
}
