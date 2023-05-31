export const isDevLocal = () => {
  return import.meta.env.MODE === 'development-local';
};
