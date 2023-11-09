import ApiService from '@/app/api/api.service';
import { List } from '@/shared/api/types/list.type';
import { Profile } from '@/shared/api/types/profile.type';
import { SearchParamsOption } from 'ky';

class SearchProfilesService extends ApiService {
  searchUsers(username?: string, signal?: AbortSignal) {
    const queryParams: SearchParamsOption = {};
    if (username) {
      queryParams['username'] = username;
    }

    return super.get<Profile[]>('/profile/search', {
      searchParams: queryParams,
      useJWT: true,
      signal,
    });
  }
}

export const searchProfilesService = new SearchProfilesService();
