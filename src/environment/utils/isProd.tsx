export const isProd = () => {
  return import.meta.env.MODE === 'production';
};
