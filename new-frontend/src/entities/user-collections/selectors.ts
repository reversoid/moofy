import { adapter } from '.';

const { selectAll } = adapter.getSelectors();

export const selectAllUserCollections = selectAll;
