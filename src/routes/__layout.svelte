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
	import '../app.css';
	import { onMount } from 'svelte';
	import LeftSidebar from '../lib/components/LeftSidebar.svelte';
	import MusicPlayer from '../lib/components/MusicPlayer.svelte';
	import RightSidebar from '../lib/components/RightSidebar.svelte';

	export let tokens;

	onMount(async () => {
		if (tokens?.access_token) {
			localStorage.setItem('accessToken', tokens.access_token);
			localStorage.setItem('refreshToken', tokens.refresh_token);
		}
	});
</script>

<main class="root">
	<LeftSidebar />
	<div class="central-section">
		<slot />
		<MusicPlayer />
	</div>
	<RightSidebar />
</main>

<style>
	.root {
		display: flex;
	}

	.central-section {
		width: 100%;
		height: 100vh;
	}
</style>
