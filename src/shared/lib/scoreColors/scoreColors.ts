export type HexColor = `#${string}`;

export interface ColorItem {
  main: HexColor;
  contrast: HexColor;
}

export const COLORS: { [key: number]: ColorItem } = {
  1: {
    main: '#ed1b24',
    contrast: '#ffffff',
  },
  2: {
    main: '#f36523',
    contrast: '#ffffff',
  },
  3: {
    main: '#f8931d',
    contrast: '#ffffff',
  },
  4: {
    main: '#ffc20d',
    contrast: '#2e2e2e',
  },
  5: {
    main: '#fef200',
    contrast: '#2e2e2e',
  },
  6: {
    main: '#cadb2a',
    contrast: '#2e2e2e',
  },
  7: {
    main: '#8ec63f',
    contrast: '#ffffff',
  },
  8: {
    main: '#3ab54b',
    contrast: '#ffffff',
  },
  9: {
    main: '#00a650',
    contrast: '#ffffff',
  },
  10: {
    main: '#008641',
    contrast: '#ffffff',
  },
};

export const getColorsByScore = (score: number | null): ColorItem | undefined =>
  COLORS[(score ?? -1)];

