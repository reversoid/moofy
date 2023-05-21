export const isTest = () => {
  return import.meta.env.MODE === 'test';
};
