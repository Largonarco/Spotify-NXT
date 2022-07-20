<script>
	import { onMount } from 'svelte';
	import { spotify_fetch } from '../utils/spotifyFetchFuncs';

	let deviceId, error;

	onMount(async () => {
		const { spotifyPlayer } = window;

		//Error handling
		spotifyPlayer.on('initialization_error', (e) => (error = e));
		spotifyPlayer.on('authentication_error', (e) => (error = e));
		spotifyPlayer.on('account_error', (e) => (error = e));
		spotifyPlayer.on('playback_error', (e) => (error = e));

		//Listeners
		spotifyPlayer.addListener('ready', ({ device_id }) => {
			deviceId = device_id;
		});
		spotifyPlayer.addListener('not_ready', () => {
			deviceId = null;
		});
		spotifyPlayer.addListener('autoplay_failed', () => {
			error = 'Autoplay is not allowed by the browser';
		});

		//Connecting to spotify
		await spotifyPlayer.connect();

		return () => {
			//Listener cleanup
			spotifyPlayer.removeListener('ready');
			spotifyPlayer.removeListener('not_ready');
			spotifyPlayer.removeListener('player_state_changed');
			spotifyPlayer.removeListener('autoplay_failed');

			// Disconnecting from spotify
			spotifyPlayer.disconnect();
		};
	});
</script>

<div class="music-player">
	<div class="playback-actions" />
	<!-- <progress id="music-position" bind:value={position} max="{}"> 32% </progress> -->
</div>

<style>
	.music-player {
		height: 100px;
		width: 100%;
		background-color: #161419;
	}
</style>
