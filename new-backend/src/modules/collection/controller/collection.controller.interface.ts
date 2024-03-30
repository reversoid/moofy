import { CreateCollectionResponse } from './responses/create-collection.response';
import { GetFullCollectionResponse } from './responses/get-full-collection.response';
import { LikeCollectionResponse } from './responses/like-collection.response';
import { UnlikeCollectionResponse } from './responses/unlike-collection.response';
import { UpdateCollectionResponse } from './responses/update-collection.response';

export interface ICollectionController {
  createCollection(...args: any): Promise<CreateCollectionResponse>;
  getFullCollection(...args: any): Promise<GetFullCollectionResponse>;
  updateCollection(...args: any): Promise<UpdateCollectionResponse>;
  deleteCollection(...args: any): Promise<void>;
  likeCollection(...args: any): Promise<LikeCollectionResponse>;
  unlikeCollection(...args: any): Promise<UnlikeCollectionResponse>;
  addFavoriteCollection(...args: any): Promise<void>;
  deleteFavoriteCollection(...args: any): Promise<void>;
  markCollectionAsViewed(...args: any): Promise<void>;
}
