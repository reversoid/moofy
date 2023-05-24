import { registerAs } from '@nestjs/config';

export default registerAs('secrets', () => {
  return {
    jwt: process.env.JWT_SECRET?.trim(),
    cookie: process.env.COOKIE_SECRET?.trim(),
  };
});
