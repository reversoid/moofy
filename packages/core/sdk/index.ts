import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export { dayjs };

export const raise = (message?: string) => {
  throw new Error(message);
};
