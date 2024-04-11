export type EditProfileDto = {
  username?: string;
  description?: string | null;
  imageUrl?: string | null;

  password?: {
    old: string;
    new: string;
  };
};
