export interface User {
  id: number;
  username: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  isPublic: boolean;
}
