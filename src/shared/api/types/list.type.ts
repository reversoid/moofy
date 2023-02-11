import { DateAsString } from "./shared";

export interface List {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: DateAsString;
  updated_at: DateAsString;
  user: {
    id: number;
    username: string;
  };
}
