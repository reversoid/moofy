import { DateAsString } from './shared';

export interface User {
  id: number;
  username: string;
  description: string | null;
  image_url: string | null;
  created_at: DateAsString;
}
