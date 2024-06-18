import { Injectable } from '@angular/core';
import { CollectionWithInfo, Profile } from '../../../shared/types';
import { ComponentStore } from '@ngrx/component-store';

export interface ProfilePageState {
  profile: Profile;
}

@Injectable()
export class ProfilePageStore extends ComponentStore<ProfilePageState> {
  profile$ = this.select((s) => s.profile);

  createCollection = this.updater((state, collection: CollectionWithInfo) => {
    return {
      profile: {
        ...state.profile,
        collections: {
          ...state.profile.collections,
          items: [collection, ...state.profile.collections.items],
        },
      },
    };
  });

  handleFollowed = this.updater((state) => ({
    profile: {
      ...state.profile,
      socialStats: {
        ...state.profile.socialStats,
        followers: state.profile.socialStats.followers + 1,
      },
      additionalInfo: {
        isSubscribed: true,
      },
    },
  }));

  handleUnfollowed = this.updater((state) => ({
    profile: {
      ...state.profile,
      socialStats: {
        ...state.profile.socialStats,
        followers: state.profile.socialStats.followers - 1,
      },
      additionalInfo: {
        isSubscribed: false,
      },
    },
  }));
}
