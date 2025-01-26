interface GlobalState {
	user: string | null;
	// collections: PaginatedData<Collection>;
	// favoriteCollections: PaginatedData<Collection>;
}

export const globalState = $state<GlobalState>({ user: null });
