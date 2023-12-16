import { User } from '../user/models/user';

export type Tokens = {
  access: string;
  refresh: string;
};

export type TokensAndUser = {
  tokens: Tokens;
  user: User;
};

export type RegisterProps = {
  username: string;
  password: string;
};

export type LoginProps = {
  username: string;
  password: string;
};
