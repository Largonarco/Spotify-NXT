<script context="module">
	export const load = async ({ fetch, url }) => {
		const code = url.searchParams.get('code');

		let tokens = await fetch(`/api/token?code=${code}`);
		tokens = await tokens.json();

		return {
			props: {
				tokens
			}
		};
	};
</script>

<script>
	import LeftSidebar from '../lib/components/LeftSidebar.svelte';
	import RightSidebar from '../lib/components/RightSidebar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	export let tokens;

	onMount(() => {
		if (tokens?.access_token) {
			localStorage.setItem('accessToken', tokens.access_token);
			localStorage.setItem('refreshToken', tokens.refresh_token);
		}
	});
</script>

<main class="root">
	<LeftSidebar />
	<slot />
	<RightSidebar />
</main>

<style>
	.root {
		display: flex;
	}
</style>
