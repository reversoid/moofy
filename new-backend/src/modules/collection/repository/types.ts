export type CreateCollectionProps = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPrivate: boolean;
};

export type UpdateCollectionProps = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  isPrivate?: boolean;
};

export type CreatePersonalCollectionProps = Pick<
  CreateCollectionProps,
  'name' | 'description' | 'imageUrl'
>;

export type UpdatePersonalCollectionProps = Pick<
  UpdateCollectionProps,
  'name' | 'description' | 'imageUrl'
>;
