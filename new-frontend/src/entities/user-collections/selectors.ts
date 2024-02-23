import { adapter } from './adapter';

const { selectAll } = adapter.getSelectors();

export const selectAllUserCollections = selectAll;
