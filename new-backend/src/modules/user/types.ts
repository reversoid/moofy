export type CreateUserProps = {
  username: string;
  passwordHash: string;
};

export type ChangeUserDataProps = {
  username?: string;
  description?: string | null;
  imageUrl?: string | null;
};
