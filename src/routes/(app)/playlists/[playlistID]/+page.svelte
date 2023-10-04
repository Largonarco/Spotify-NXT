<script>
	import { FastAverageColor } from 'fast-average-color';
	import { playerParams, user } from '../../../../lib/utils/stores';
	import { intlFormatDistance, intervalToDuration } from 'date-fns';
	import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

	export let data;
	$: isLiked = null;
	$: playlist = data.playlist;
	$: if ($user && playlist) {
		spotify_fetch(
			`https://api.spotify.com/v1/playlists/${playlist.id}/followers/contains?ids=${$user.id}`
		).then((val) => (isLiked = val));
	}
	$: if (playlist?.images[2].url) {
		const fac = new FastAverageColor();
		fac
			.getColorAsync(playlist.images[2].url)
			.then(
				(avgColor) =>
					(document.getElementById(
						'playlist'
					).style.background = `linear-gradient(180deg, ${avgColor.rgba}, 40%, rgb(0, 17, 28) 95% )`)
			);
	}

	const trackHover = async (index) => {
		const isLiked = await spotify_fetch(
			`https://api.spotify.com/v1/me/tracks/contains?ids=${$user.id}`
		);

		if (isLiked) {
			document.getElementById(`.like-icon ${index}`).style.fill = '#ef233c';
		}
	};

	const handlePlaylistPlay = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${$playerParams.deviceId}`,
					'PUT',
					{
						context_uri: playlist.uri
					}
			  )
			: null;
	};

	const handlePlaylistPause = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/pause?device_id=${$playerParams.deviceId}`,
					'PUT'
			  )
			: null;
	};

	const handlePlaylistLike = async () => {
		await spotify_fetch(
			`https://api.spotify.com/v1/playlists/${playlist.id}/followers`,
			isLiked ? 'DELETE' : 'PUT'
		);

		isLiked = !isLiked;
	};

	const handleIndividualTrackPlay = async (trackOffset) => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${$playerParams.deviceId}`,
					'PUT',
					{
						context_uri: playlist.uri,
						offset: { position: trackOffset }
					}
			  )
			: null;
	};

	const handleIndividualTrackLike = async (e, id) => {
		await spotify_fetch(`https://api.spotify.com/v1/me/tracks`, 'PUT', {
			ids: [id]
		});

		e.target.style.color = '#ef233c';
	};
</script>

<div class="playlist-page">
	{#if playlist}
		<div class="playlist" id="playlist">
			<img class="image" src={playlist.images[0].url} alt={playlist.name} />

			<div class="details">
				<h3 class="title">{playlist.name}</h3>
				<h4 class="description">{playlist.description}</h4>
				<div class="sub-details">
					<div class="sub-detail">
						<svg
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
							class="bi bi-person sub-detail-icon"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
						</svg>
						<p class="sub-detail-text">{playlist.owner.display_name}</p>
					</div>
					<div class="sub-detail">
						<button on:click={handlePlaylistLike}>
							{#if isLiked}
								<svg
									width="20"
									height="20"
									fill="#ef233c"
									stroke="#ef233c"
									viewBox="-2 -2 20 20 "
									class="bi bi-heart-fill sub-detail-icon"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
								</svg>
							{:else}
								<svg
									width="20"
									height="20"
									stroke="#ef233c"
									fill="currentColor"
									viewBox="-2 -2 20 20"
									class="bi bi-heart sub-detail-icon"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
								</svg>
							{/if}
						</button>
						<p class="sub-detail-text">{playlist.followers.total.toLocaleString()} likes</p>
					</div>
					<div class="sub-detail">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							class="bi bi-music-note sub-detail-icon">
							<path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
							<path fill-rule="evenodd" d="M9 3v10H8V3h1z" />
							<path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
						</svg>
						<p class="sub-detail-text">{playlist.tracks.total} tracks</p>
					</div>
				</div>
			</div>

			<div class="actions">
				{#if $playerParams.contextURI === playlist.uri && !$playerParams.isPaused}
					<button class="play-button" style="margin-right: 1rem;" on:click={handlePlaylistPause}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							class="bi bi-pause"
							viewBox="0 0 16 16">
							<path
								d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
						</svg>
					</button>
				{:else}
					<button class="play-button" style="margin-right: 1rem;" on:click={handlePlaylistPlay}>
						<svg
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 16 16"
							class="bi bi-play-fill"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<div class="track-list">
			<div class="headings">
				<p class="title">Title</p>
				<p class="album">Album</p>
				<p class="added_on">Added</p>
				<p class="duration">Duration</p>
				<p class="like" />
			</div>

			<div class="tracks">
				{#each playlist.tracks.items as item, index}
					<div class="track" on:click={() => handleIndividualTrackPlay(index)}>
						<div class="title">
							<img class="poster" src={item.track.album.images[2].url} alt={item.track.name} />
							<div>
								<p class="name">{item.track.name}</p>
								<p class="artist">
									{item.track.artists.map((artist, index) =>
										index !== item.track.artists.length - 1 ? ` ${artist.name}` : ` ${artist.name}`
									)}
								</p>
							</div>
						</div>
						<div class="album"><p>{item.track.album.name}</p></div>
						<div class="added_on">
							<p>
								{item.added_at === '1970-01-01T00:00:00Z'
									? `   `
									: intlFormatDistance(new Date(item.added_at), new Date())}
							</p>
						</div>
						<div class="duration">
							<p>
								{`${intervalToDuration({ start: 0, end: item.track.duration_ms }).minutes} :  
									${intervalToDuration({ start: 0, end: item.track.duration_ms }).seconds}`}
							</p>
						</div>
						<button class="like" on:click={handleIndividualTrackLike}>
							<svg
								id="like-icon ${index}"
								width="20"
								height="20"
								stroke="#ef233c"
								fill="transparent"
								viewBox="-2 -2 20 20 "
								class="bi bi-heart-fill sub-detail-icon"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="loader">
			<img src="/images/loader.svg" alt="Loader" />
		</div>
	{/if}
</div>

<style>
	.playlist-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #00111c;
		overflow-y: auto;
	}

	.playlist {
		width: 100%;
		padding: 1.5rem;
		position: relative;
		display: flex;
	}

	.playlist .image {
		width: 200px;
		height: 200px;
		border-radius: 0.5rem;
		margin-right: 2rem;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	.playlist .details {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.details .title {
		font-size: 44px;
		font-weight: 800;
		margin-bottom: 0.25rem;
	}

	.details .description {
		font-size: 16px;
		font-weight: 400;
		margin-bottom: 0.75rem;
	}

	.details .sub-details {
		display: flex;
		align-items: center;
	}

	.sub-details .sub-detail {
		display: flex;
		align-items: center;
		margin-right: 1rem;
	}

	.sub-detail .sub-detail-icon {
		margin-right: 0.5rem;
	}

	.playlist .actions {
		position: absolute;
		bottom: 0;
		right: 1.5rem;
	}

	.playlist .actions .play-button {
		background-color: white;
		padding: 1rem;
		border-radius: 50%;
		color: black;
	}

	.playlist .actions .play-button:hover {
		transform: scale(1.05);
	}

	.track-list {
		width: 100%;
		padding: 1.5rem;
	}

	.track-list .headings {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #a6a6a6;
	}

	.headings .title {
		flex: 8;
	}

	.headings .album {
		flex: 4;
	}

	.headings .added_on {
		flex: 2;
		text-align: center;
	}

	.headings .duration {
		flex: 1;
		text-align: center;
	}

	.headings .like {
		flex: 1;
	}

	.track-list .tracks {
		width: 100%;
		padding-top: 0.5rem;
		padding-bottom: 100px;
		display: flex;
		flex-direction: column;
	}

	.track-list .tracks .track {
		width: 100%;
		margin: 0.5rem 0;
		display: flex;
	}

	.track-list .tracks .track:hover {
		cursor: pointer;
	}

	.tracks .track .title {
		flex: 8;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.track .title .poster {
		width: 48px;
		height: 48px;
		border-radius: 0.25rem;
		margin-right: 0.5rem;
	}

	.track .title div {
		display: flex;
		flex-direction: column;
	}

	.track .title div .name {
		width: calc(((100vw - 260px - 3rem) / 2 - 56px - 0.5rem));
		font-size: 12px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.track .title div .artist {
		width: calc(((100vw - 260px - 3rem) / 2 - 64px - 0.5rem));
		font-size: 12px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tracks .track .album {
		flex: 4;
	}

	.tracks .track .album p {
		width: calc(((100vw - 260px - 3rem) / 4 - 16px));
		font-size: 12px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tracks .track .added_on {
		flex: 2;
		min-width: 0;
		font-size: 12px;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tracks .track .duration {
		flex: 1;
		min-width: 0;
		font-size: 12px;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tracks .track .like {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loader {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
