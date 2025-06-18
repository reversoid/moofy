import type { CollectionDto } from '@repo/api/dtos';

// we can use just i118n actually
export class CollectionNameBuilder {
	justTextTokens: string[] = [];
	toWrapTokens: string[] = [];

	constructor(collection: CollectionDto) {
		if (collection.type === 'default') {
			this.justTextTokens = [collection.name];
			return;
		}

		if (collection.type === 'personal') {
			this.justTextTokens = ['От'];
			this.toWrapTokens = [collection.creator.username];
			return;
		}

		if (collection.type === 'watch') {
			this.justTextTokens = ['Посмотреть'];
			return;
		}

		throw new Error(`Unknown type of collection "${collection.type}"`);
	}

	toString(): string {
		return this.justTextTokens.concat(this.toWrapTokens).join(' ');
	}
}
