import { Profile } from './profile.type';

/** Info of profile without lists */
export type ProfileInfo = Omit<Profile, 'allLists' | 'favLists'>;
