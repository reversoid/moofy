import { Profile } from './profile.type';

/** Describes short profile info for previews */
export type ProfileShort = Pick<
  Profile,
  'id' | 'image_url' | 'username' | 'additionalInfo'
>;
