<script>
	import { beforeUpdate, onMount } from 'svelte';
	import { spotify_fetch } from '../utils/spotifyFetchFuncs';

	let songProgress = 0,
		songDuration = 0,
		item,
		contextURI,
		isPlaying,
		shuffleState,
		repeatState,
		volume,
		id,
		deviceId,
		error;

	onMount(async () => {
		const { spotifyPlayer } = window;

		spotifyPlayer.on('initialization_error', (e) => (error = e));
		spotifyPlayer.on('authentication_error', (e) => (error = e));
		spotifyPlayer.on('account_error', (e) => (error = e));
		spotifyPlayer.on('playback_error', (e) => (error = e));

		spotifyPlayer.addListener('ready', ({ device_id }) => {
			deviceId = device_id;
		});
		spotifyPlayer.addListener('not_ready', () => {
			deviceId = null;
		});
		spotifyPlayer.addListener(
			'player_state_changed',
			async ({ position, duration, track_window: { current_track } }) => {
				const currState = await spotifyPlayer.getCurrentState();
				const vol = await spotifyPlayer.getVolume();

				songProgress = Math.round(position / 1000);
				songDuration = Math.round(duration / 1000);
				item = current_track;
				contextURI = currState.context.uri;
				isPlaying = !currState.paused;
				shuffleState = currState.shuffle;
				repeatState = currState.repeat_mode;
				volume = vol * 100;

				if (isPlaying && songProgress < songDuration && !id) {
					id = setInterval(() => {
						songProgress++;
					}, 1000);
				} else if (!isPlaying && id) {
					clearInterval(id);
				}
			}
		);

		const isConnected = await spotifyPlayer.connect();

		if (isConnected) {
			const nowPlayingContext = JSON.parse(localStorage.getItem('nowPlayingContext'));

			if (nowPlayingContext) {
				item = nowPlayingContext.item;
				contextURI = nowPlayingContext.contextURI;
				isPlaying = nowPlayingContext.isPlaying;
				shuffleState = nowPlayingContext.shuffleState;
				repeatState = nowPlayingContext.repeatState;
				volume = nowPlayingContext.volume;
			}
		}

		return () => {
			spotifyPlayer.removeListener('ready');
			spotifyPlayer.removeListener('not_ready');
			spotifyPlayer.removeListener('player_state_changed');

			spotifyPlayer.disconnect();
		};
	});

	beforeUpdate(() => {
		item
			? localStorage.setItem(
					'nowPlayingContext',
					JSON.stringify({
						item,
						contextURI,
						isPlaying,
						shuffleState,
						repeatState,
						volume
					})
			  )
			: null;
	});

	const handlePlay = async () => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
					'PUT',
					{
						context_uri: contextURI,
						position_ms: songProgress * 1000
					}
			  )
			: null;
	};

	const handlePause = async () => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
					'PUT'
			  )
			: null;
	};

	const nextTrack = async () => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
					'POST'
			  )
			: null;
	};

	const prevTrack = async () => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
					'POST'
			  )
			: null;
	};

	const handleShuffle = async () => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/shuffle?device_id=${deviceId}&state=${!shuffleState}`,
					'PUT'
			  )
			: null;
	};

	const handleRepeat = async () => {
		repeatState === 2 ? (repeatState = 0) : repeatState++;

		let repeatMode;
		switch (repeatState) {
			case 0:
				repeatMode = 'off';
				break;
			case 1:
				repeatMode = 'context';
				break;
			case 2:
				repeatMode = 'track';
				break;
		}

		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/repeat?device_id=${deviceId}&state=${repeatMode}`,
					'PUT'
			  )
			: null;
	};

	const handleVolume = async (type) => {
		deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/volume?device_id=${deviceId}&volume_percent=${
						type === 'incr' ? volume + 1 : volume - 1
					}`,
					'PUT'
			  )
			: null;
	};
</script>

<div class="music-player" style="display: {item ? 'flex' : 'none'}">
	<div class="music-details">
		{#if item}
			<img src={item.album.images[1].url} alt={item.name} class="music-img" />
			<div class="music-desc">
				<div class="h-stack">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						class="bi-icon-stack bi-music-note"
						viewBox="0 0 16 16">
						<path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
						<path fill-rule="evenodd" d="M9 3v10H8V3h1z" />
						<path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
					</svg>
					<h5 class="music-name">{item.name}</h5>
				</div>
				<div class="h-stack">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						class="bi-icon-stack bi-person"
						viewBox="0 0 16 16">
						<path
							d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
					</svg>
					<h6 class="music-artist">{item.artists[0].name}</h6>
				</div>
			</div>
		{/if}
	</div>

	<div class="divider" />

	<div class="music-playback-control">
		<div class="user-actions">
			<div class="song-continuity-actions">
				<button style="margin-right: 1rem;" on:click={handleRepeat}>
					{#if repeatState === 2}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-repeat-1"
							viewBox="0 0 16 16">
							<path
								d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4h6Zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z" />
							<path
								d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0v-5Z" />
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill={repeatState === 0 ? 'currentColor' : 'rgb(206, 91, 34)'}
							class="bi bi-repeat"
							viewBox="0 0 16 16">
							<path
								d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
						</svg>
					{/if}
				</button>
				<button on:click={handleShuffle}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill={shuffleState ? 'rgb(206, 91, 34)' : 'currentColor'}
						class="bi bi-shuffle"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" />
						<path
							d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
					</svg>
				</button>
			</div>

			<div class="playback-actions">
				<button style="margin-right: 1rem;" on:click={prevTrack}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-chevron-left"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
					</svg>
				</button>
				{#if isPlaying}
					<button class="play-button" style="margin-right: 1rem;" on:click={handlePause}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							class="bi bi-pause"
							viewBox="0 0 16 16">
							<path
								d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
						</svg>
					</button>
				{:else}
					<button
						type="button"
						class="play-button"
						style="margin-right: 1rem;"
						on:click={handlePlay}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							class="bi bi-play"
							viewBox="0 0 16 16">
							<path
								d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
						</svg>
					</button>
				{/if}
				<button style="margin-right: 1rem;" on:click={nextTrack}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-chevron-right"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
					</svg>
				</button>
			</div>

			<div class="volume-control">
				<button style="margin-right: 1rem;" on:click={() => handleVolume('decr')}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="currentColor"
						class="bi bi-volume-down"
						viewBox="0 0 16 16">
						<path
							d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zM6.312 6.39 8 5.04v5.92L6.312 9.61A.5.5 0 0 0 6 9.5H4v-3h2a.5.5 0 0 0 .312-.11zM12.025 8a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z" />
					</svg></button>
				<button on:click={() => handleVolume('incr')}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-volume-up"
						viewBox="0 0 16 16">
						<path
							d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
						<path
							d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
						<path
							d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z" />
					</svg></button>
			</div>
		</div>

		<input
			class="progress-bar"
			type="range"
			min="0"
			max={songDuration}
			bind:value={songProgress}
			step="1" />
	</div>
</div>

<style>
	.music-player {
		position: fixed;
		left: 260px;
		bottom: 0;
		right: 80px;
		padding: 15px 0;
		height: 100px;
		background-color: #1a181e;
		border-left: 1px solid #212529;
		border-right: 1px solid #212529;
	}

	.music-details {
		margin: 0 1.5rem;
		min-width: 300px;
		display: flex;
	}

	.music-img {
		width: auto;
		height: 100%;
		margin-right: 1rem;
		border-radius: 0.25rem;
	}

	.music-desc {
		margin-top: auto;
		display: flex;
		flex-direction: column;
	}

	.h-stack {
		display: flex;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.bi-icon-stack {
		margin-right: 0.5rem;
	}

	.music-name {
		width: 192px;
		font-size: 14px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.music-artist {
		width: 175px;
		font-size: 14px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.divider {
		width: 2px;
		height: 100%;
		background-color: #b2b2b2;
	}

	.music-playback-control {
		margin: 0 2rem;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.user-actions {
		display: flex;
		justify-content: space-between;
		height: 50px;
	}

	.song-continuity-actions {
		display: flex;
		align-items: center;
	}

	.playback-actions {
		display: flex;
		align-items: center;
	}

	.volume-control {
		display: flex;
		align-items: center;
	}

	.play-button {
		background-color: white;
		padding: 0.5rem;
		border-radius: 50%;
		color: black;
	}

	.progress-bar {
		width: 70%;
		align-self: center;
	}
</style>
