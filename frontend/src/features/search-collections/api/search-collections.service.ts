import ApiService from '@/shared/api/api.service';
import { List, ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

class SearchCollectionsService extends ApiService {
  searchCollections(search?: string) {
    const queryParams: SearchParamsOption = {}
    if (search) {
        queryParams['search'] = search
    }

    return super.get<IterableResponse<ListWithAdditionalInfo>>('/list/public', {
      searchParams: queryParams
    });
  }
}

export const searchCollectionsService = new SearchCollectionsService()