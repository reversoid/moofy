<script lang="ts" generics="T extends Record<string, any>">
	import type { CollectionDto } from '@repo/api/dtos';
	import type { Component, ComponentProps, Snippet } from 'svelte';
	import { CollectionNameBuilder } from './collection-name-builder';

	type Props = {
		collection: CollectionDto;
		wrapperComponent?: Component<T>;
		wrapperProps?: T;
	};

	const props: Props = $props();

	let collectionName = $derived(new CollectionNameBuilder(props.collection));
</script>

{#if props.wrapperComponent}
	{collectionName.justTextTokens.join(' ')}

	{#each collectionName.toWrapTokens as t}
		<props.wrapperComponent {...props.wrapperProps as any}>{t}</props.wrapperComponent>
	{/each}
{:else}
	{collectionName.toString()}
{/if}
