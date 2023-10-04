<script>
	import '../../app.css';
	import { onMount } from 'svelte';
	import LeftSidebar from '../../lib/components/LeftSidebar.svelte';
	import MusicPlayer from '../../lib/components/MusicPlayer.svelte';
	import RightSidebar from '../../lib/components/RightSidebar.svelte';

	export let data;

	onMount(async () => {
		if (data?.tokens?.access_token) {
			localStorage.setItem('accessToken', data.tokens.access_token);
			localStorage.setItem('refreshToken', data.tokens.refresh_token);
		}
	});
</script>

<main class="root">
	<LeftSidebar />
	<div class="central-section">
		<slot />
		<MusicPlayer />
	</div>
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
