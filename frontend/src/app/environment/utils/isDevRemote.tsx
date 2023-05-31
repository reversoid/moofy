export const isDevRemote = () => {
  return import.meta.env.MODE === 'development-remote';
};
