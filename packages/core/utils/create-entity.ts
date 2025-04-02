import { Id } from "./id";

/**
 * Type that represents the properties to make a `Creatable`
 * @template T - The constructor function of the class.
 */
type CreateProps<T extends new (...args: any) => any> = Omit<
  ConstructorParameters<T>[0],
  "id"
>;

/**
 * Type that represents a creatable instance.
 * @template T - The constructor function of the class.
 */
export type Creatable<T extends { id: Id }> = Omit<T, "id">;

/**
 * Function that returns a function to create a new instance of a class.
 */
export const buildCreate = <T extends new (...args: any) => any>(
  constructor: T
) => {
  return (props: CreateProps<T>): Creatable<InstanceType<T>> => {
    return new constructor(props);
  };
};
