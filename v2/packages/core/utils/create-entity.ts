export type CreatableEntity<T> = Omit<T, "id">;

type PropsType<C> = C extends new (props: infer P) => any ? P : never;

/** Builds a function that can create entity ommiting Id in output */
export function initCreateEntity<C extends new (props: any) => any>(
  cls: C
): (params: Omit<PropsType<C>, "id">) => Omit<InstanceType<C>, "id"> {
  return (params: Omit<PropsType<C>, "id">): Omit<InstanceType<C>, "id"> => {
    return new cls(params);
  };
}
