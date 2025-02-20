import ColorHash from 'color-hash';

// it exports a default in default export, so we need to use this hack to get the constructor

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultConstructor = (ColorHash as any).default as typeof ColorHash | undefined;

export const colorHash: ColorHash = new (defaultConstructor ?? ColorHash)();
