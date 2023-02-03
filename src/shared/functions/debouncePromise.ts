interface PendingItem<T> {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

export const debouncePromise = <T>(fn: (...args: any) => Promise<T>, ms = 0): () => Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const pending: PendingItem<T>[] = [];

  return (...args: Parameters<typeof fn>): Promise<T> =>
    new Promise((res, rej) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentPending = [...pending];
        pending.length = 0;
        Promise.resolve(fn.apply(this, args)).then(
          (data) => {
            currentPending.forEach(({ resolve }) => resolve(data));
          },
          (error) => {
            currentPending.forEach(({ reject }) => reject(error));
          },
        );
      }, ms);
      pending.push({ resolve: res, reject: rej });
    });
};
