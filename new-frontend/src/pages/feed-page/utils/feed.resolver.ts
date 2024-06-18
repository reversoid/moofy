import { ResolveFn } from '@angular/router';
import { CollectionWithInfo, PaginatedData } from '../../../shared/types';
import { inject } from '@angular/core';
import { FeedService } from '../../../features/feed/utils/feed.service';
import { forkJoin, map } from 'rxjs';

export const FeedResolver: ResolveFn<{
  latestUpdated: PaginatedData<CollectionWithInfo>;
  unseen: PaginatedData<CollectionWithInfo>;
}> = () => {
  const service = inject(FeedService);
  return forkJoin([service.getLatestUpdatedCollections(), service.getUnseenCollections()]).pipe(
    map(([latestUpdated, unseen]) => ({ latestUpdated, unseen })),
  );
};
