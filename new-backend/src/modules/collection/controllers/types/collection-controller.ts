import { AddToFavoriteResponse } from '../responses/add-favorite.response';
import { CreateCollectionResponse } from '../responses/create-collection.response';
import { DeleteCollectionResponse } from '../responses/delete-collection.response';
import { GetCollectionResponse } from '../responses/get-collection.response';
import { GetFullCollectionResponse } from '../responses/get-full-collection.response';
import { LikeCollectionResponse } from '../responses/like-collection.response';
import { RemoveFromFavoriteResponse } from '../responses/remove-favorite.response';
import { UnlikeCollectionResponse } from '../responses/unlike-collection.response';
import { UpdateCollectionResponse } from '../responses/update-collection.response';
import { UploadImageResponse } from '../responses/upload-image.response';

export interface ICollectionController {
  createCollection(): Promise<CreateCollectionResponse>;
  getCollection(id: string): Promise<GetCollectionResponse>;
  getFullCollection(id: string): Promise<GetFullCollectionResponse>;
  uploadFile(): Promise<UploadImageResponse>;
  updateCollection(): Promise<UpdateCollectionResponse>;
  deleteCollection(id: string): Promise<DeleteCollectionResponse>;
  likeCollection(id: string): Promise<LikeCollectionResponse>;
  unlikeCollection(id: string): Promise<UnlikeCollectionResponse>;
  addFavoriteCollection(id: string): Promise<AddToFavoriteResponse>;
  deleteFavoriteCollection(id: string): Promise<RemoveFromFavoriteResponse>;
  markCollectionAsViewed(id: string): Promise<void>;
}
