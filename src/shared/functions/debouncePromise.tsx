interface PendingItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

export const debouncePromise = (fn: (...args: any) => Promise<any>, ms = 0) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const pending: PendingItem[] = [];

  return (...args: Parameters<typeof fn>) =>
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
