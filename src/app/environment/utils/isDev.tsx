export const isDev = () => {
  return import.meta.env.MODE === 'development';
};
