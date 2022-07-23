<script>
	import { onMount } from 'svelte';
	import { spotify_fetch } from '../utils/spotifyFetchFuncs';

	let isPlaying = false;
	let songProgress = 0;
	let songDuration = 0;
	let item = { id: null };
	let deviceId;
	let activeDevice;
	let repeatState = 'off';
	let shuffleState = 'off';
	let id;
	let error;
	$: {
		id = setTimeout(
			() => (songProgress < songDuration && isPlaying ? songProgress++ : clearTimeout(id)),
			1000
		);
	}

	onMount(async () => {
		const { spotifyPlayer } = window;

		spotifyPlayer.on('initialization_error', (e) => (error = e));
		spotifyPlayer.on('authentication_error', (e) => (error = e));
		spotifyPlayer.on('account_error', (e) => (error = e));
		spotifyPlayer.on('playback_error', (e) => (error = e));

		spotifyPlayer.addListener('ready', async ({ device_id }) => {
			deviceId = device_id;
		});
		spotifyPlayer.addListener('not_ready', () => {
			deviceId = null;
		});
		spotifyPlayer.addListener(
			'player_state_changed',
			async ({ position, duration, track_window: { current_track } }) => {
				songProgress = Math.round(position / 1000);
				songDuration = Math.round(duration / 1000);
				item = current_track;

				const state = await spotifyPlayer.getCurrentState();
				isPlaying = !state.paused;
			}
		);

		const isConnected = await spotifyPlayer.connect();

		if (isConnected) {
			const playerState = await spotify_fetch('https://api.spotify.com/v1/me/player');

			if (!playerState.error) {
				songProgress = Math.round(playerState.progress_ms / 1000);
				songDuration = Math.round(playerState.item?.duration_ms / 1000);
				item = playerState.item;
				activeDevice = playerState.device;
				repeatState = playerState.repeat_state;
				shuffleState = playerState.shuffle_state;
			}
		}

		return () => {
			spotifyPlayer.removeListener('ready');
			spotifyPlayer.removeListener('not_ready');
			spotifyPlayer.removeListener('player_state_changed');

			spotifyPlayer.disconnect();
		};
	});
</script>

<div class="music-player">
	<div class="music-details">
		<img src="" alt="" />
	</div>
	<div class="music-playback-control">
		<div class="playback-actions" />
		<input
			class="position-bar"
			type="range"
			min="0"
			max={songDuration}
			bind:value={songProgress}
			step="1" />
	</div>
</div>

<style>
	.music-player {
		height: 100px;
		width: 100%;
		display: flex;
		background-color: #161419;
	}

	.music-details {
		display: flex;
		flex-direction: column;
		width: 300px;
	}

	.music-playback-control {
		display: flex;
		flex-direction: column;
	}

	.playback-actions {
		display: flex;
		height: 50px;
	}
</style>
