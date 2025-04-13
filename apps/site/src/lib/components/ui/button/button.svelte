<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'border border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
				secondary:
					'border border-transparentbg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'border border-transparent hover:bg-accent hover:text-accent-foreground',
				link: 'border border-transparent text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		} & {
			tag?: keyof HTMLElementTagNameMap;
			isLoading?: boolean;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import { IconLoader2 } from '@tabler/icons-svelte';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		children,
		tag,
		isLoading,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		onclick={restProps.onclick}
		class={cn(buttonVariants({ variant, size }), className)}
		{href}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else if tag}
	<svelte:element
		this={tag}
		class={cn(buttonVariants({ variant, size }), className)}
		role="button"
		tabindex={-1}
		onclick={restProps.onclick}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</svelte:element>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className, 'relative')}
		onclick={restProps.onclick}
		disabled={restProps.disabled || isLoading || false}
		{type}
		{...restProps}
	>
		{#if isLoading}
			<span class="absolute inset-0 flex items-center justify-center">
				<IconLoader2 class="animate-spin" />
			</span>
			<div class="invisible inline-flex items-center justify-center gap-2">
				{@render children?.()}
			</div>
		{:else}
			<div class={cn('inline-flex w-full items-center justify-center gap-2', className)}>
				{@render children?.()}
			</div>
		{/if}
	</button>
{/if}
