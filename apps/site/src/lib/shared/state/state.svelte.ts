import type { UserDto } from '@repo/api/dtos';

interface GlobalState {
	currentUser: UserDto | null;
}

export const globalState = $state<GlobalState>({
	currentUser: null
});

export const setCurrentUser = (user: UserDto | null) => {
	globalState.currentUser = user;
};
