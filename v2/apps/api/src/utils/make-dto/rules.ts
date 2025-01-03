import { Collection, Film, Review, Session, User } from "@repo/core/entities";
import { Id } from "@repo/core/utils";

type PickableFields<T> = {
  [K in keyof T]?: T[K] extends object
    ? boolean | PickableFields<T[K]>
    : boolean;
};

type DtoRule<T extends object> = [new (...args: any[]) => T, PickableFields<T>];

const registerRule = <T extends object>(rule: DtoRule<T>) => rule;

const getRules = (...rules: DtoRule<any>[]) => {
  return new Map<Function, PickableFields<object>>(rules);
};

export const dtoRules = getRules(
  registerRule([
    User,
    {
      id: true,
      username: true,
      createdAt: true,
      description: true,
      imageUrl: true,
    },
  ]),

  registerRule([
    Collection,
    {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      creator: true,
      imageUrl: true,
      isPublic: true,
      updatedAt: true,
    },
  ]),

  registerRule([
    Id,
    {
      value: true,
    },
  ]),

  registerRule([
    Session,
    {
      id: true,
      user: true,
      expiresAt: true,
    },
  ]),

  registerRule([
    Review,
    {
      id: true,
      createdAt: true,
      updatedAt: true,
      collectionId: true,
      description: true,
      film: true,
      score: true,
    },
  ]),

  registerRule([
    Film,
    {
      id: true,
      filmLength: true,
      genres: true,
      name: true,
      posterPreviewUrl: true,
      type: true,
      year: true,
      posterUrl: true,
    },
  ])
);
