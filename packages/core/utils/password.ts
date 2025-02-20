import * as bcrypt from "bcrypt";

export const hashPassword = (password: string) => bcrypt.hash(password, 13);

export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
) => bcrypt.compare(plainTextPassword, hashedPassword);
