<script context="module">
	import { spotify_fetch_get } from '../lib/utils/spotifyFetchFuncs';

	export const load = async () => {
		if (typeof window !== 'undefined') {
			let playlists = await spotify_fetch_get('https://api.spotify.com/v1/me/playlists');

			console.log(playlists);
		}

		return {
			props: {}
		};
	};
</script>

<script>
	import LeftSidebar from '../lib/components/LeftSidebar.svelte';
	import RightSidebar from '../lib/components/RightSidebar.svelte';

	import '../app.css';
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
