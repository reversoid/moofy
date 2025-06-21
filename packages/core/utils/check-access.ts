import { err, ok, Result } from "resulto";
import { Collection, User } from "../entities";
import {
  NoAccessToPrivateCollectionError,
  NotOwnerOfCollectionError,
} from "../services";

type CheckCollectionAccessProps = {
  by?: User["id"];
  collection: Collection;
  type: "R" | "RW";
};

export function checkCollectionAccess<T extends CheckCollectionAccessProps>(
  props: T
): Result<
  Collection,
  T["type"] extends "RW"
    ? NotOwnerOfCollectionError
    : NoAccessToPrivateCollectionError
> {
  const isOwnerRequest = props.collection.creator.id.value === props.by?.value;
  if (props.type === "RW") {
    if (!isOwnerRequest) {
      return err(new NotOwnerOfCollectionError());
    }
  } else {
    if (!props.collection.isPublic && !isOwnerRequest) {
      return err(new NoAccessToPrivateCollectionError());
    }
  }

  return ok(props.collection);
}
