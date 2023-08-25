import ApiService from '@/shared/api/api.service';
import { List } from '@/shared/api/types/list.type';
import { Profile } from '@/shared/api/types/profile.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

class SearchProfilesService extends ApiService {
  searchUsers(username?: string) {
    const queryParams: SearchParamsOption = {};
    if (username) {
      queryParams['username'] = username;
    }

    return super.get<Profile[]>('/profile/search', {
      searchParams: queryParams,
      useJWT: true,
    });
  }
}

export const searchProfilesService = new SearchProfilesService();
