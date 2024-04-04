<script>
	import { FastAverageColor } from 'fast-average-color';
	import { playerParams } from '../../../../lib/utils/stores';
	import { intervalToDuration, format, parseISO } from 'date-fns';
	import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

	export let data;
	$: isLiked = null;
	$: album = data.album;
	$: if (album) {
		spotify_fetch(`https://api.spotify.com/v1/me/albums/contains?ids=${album.id}`).then(
			(val) => (isLiked = val[0])
		);
	}
	$: if (album?.images[2].url) {
		const fac = new FastAverageColor();
		fac
			.getColorAsync(album.images[2].url)
			.then(
				(avgColor) =>
					(document.getElementById(
						'album'
					).style.background = `linear-gradient(180deg, ${avgColor.rgba}, 40%, rgb(0, 17, 28) 95% )`)
			);
	}
	$: console.log(isLiked);

	const handleAlbumPlay = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${$playerParams.deviceId}`,
					'PUT',
					{
						context_uri: album.uri,
						offset: { position: 0 }
					}
			  )
			: null;
	};

	const handleAlbumPause = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/pause?device_id=${$playerParams.deviceId}`,
					'PUT'
			  )
			: null;
	};

	const handleAlbumLike = async () => {
		await spotify_fetch(
			`https://api.spotify.com/v1/me/albums?ids=${album.id}`,
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
						context_uri: album.uri,
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

<div class="album-page">
	{#if album}
		<div class="album" id="album">
			<img class="image" src={album.images[0].url} alt={album.name} />

			<div class="details">
				<h3 class="title">{album.name}</h3>
				<h4 class="label">{album.label}</h4>
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
						<a class="sub-detail-text artist-name" href="/artists/{album.artists[0].id}">
							<p>{album.artists[0].name}</p>
						</a>
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
						<p class="sub-detail-text track-count">{album.total_tracks} tracks</p>
					</div>
					<div class="sub-detail">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							class="bi bi-clock-history sub-detail-icon">
							<path
								d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
							<path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
							<path
								d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
						</svg>
						<p class="sub-detail-text release-date">
							{format(parseISO(album.release_date), 'd MMM yyyy')}
						</p>
					</div>
					<div class="sub-detail">
						<button on:click={handleAlbumLike}>
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
					</div>
				</div>
			</div>

			<div class="actions">
				{#if $playerParams.contextURI === album.uri && !$playerParams.isPaused}
					<button class="play-button" style="margin-right: 1rem;" on:click={handleAlbumPause}>
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
					<button class="play-button" style="margin-right: 1rem;" on:click={handleAlbumPlay}>
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
				<p class="duration">Duration</p>
				<p class="like" />
			</div>

			<div class="tracks">
				{#each album.tracks.items as track, index}
					<div class="track" on:click={() => handleIndividualTrackPlay(index)}>
						<div class="title">
							<div>
								<div class="name">
									{#if track.explicit}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											fill="currentColor"
											class="bi bi-explicit"
											viewBox="0 0 16 16">
											<path
												d="M6.826 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z" />
											<path
												d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11ZM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11Z" />
										</svg>
									{/if}
									<p>{track.name}</p>
								</div>

								<p class="artist">
									{#each track.artists as artist, index}
										{#if index !== track.artists.length - 1}
											<a href="/artists/{artist.id}"><span>{artist.name}, </span></a>
										{:else}
											<a href="/artists/{artist.id}"><span>{artist.name}</span></a>
										{/if}
									{/each}
								</p>
							</div>
						</div>
						<div class="duration">
							<p>
								{`${intervalToDuration({ start: 0, end: track.duration_ms }).minutes} :  
									${intervalToDuration({ start: 0, end: track.duration_ms }).seconds}`}
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
	.album-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #00111c;
		overflow-y: auto;
	}

	.album-page .album {
		width: 100%;
		padding: 1.5rem;
		position: relative;
		display: flex;
	}

	.album-page .album .image {
		width: 200px;
		height: 200px;
		border-radius: 0.5rem;
		margin-right: 2rem;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	.album-page .album .details {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.album .details .title {
		font-size: 44px;
		font-weight: 800;
		margin-bottom: 0.25rem;
	}

	.album .details .label {
		font-size: 16px;
		font-weight: 400;
		margin-bottom: 0.75rem;
	}

	.album .details .sub-details {
		display: flex;
		align-items: center;
	}

	.details .sub-details .sub-detail {
		display: flex;
		align-items: center;
		margin-right: 1rem;
	}

	.details .sub-detail .sub-detail-icon {
		margin-right: 0.5rem;
	}

	.details .sub-detail .sub-detail-text {
		font-size: 16px;
		font-weight: 400;
	}

	.details .sub-detail .artist-name:hover {
		text-decoration: underline;
	}

	.album-page .album .actions {
		position: absolute;
		bottom: 0;
		right: 1.5rem;
	}

	.album .actions .play-button {
		background-color: white;
		padding: 1rem;
		border-radius: 50%;
		color: black;
	}

	.album .actions .play-button:hover {
		transform: scale(1.05);
	}

	.album-page .track-list {
		width: 100%;
		padding: 1.5rem;
		padding-bottom: 148px;
	}

	.album-page .track-list .headings {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #a6a6a6;
	}

	.track-list .headings .title {
		flex: 8;
	}

	.track-list .headings .duration {
		flex: 1;
		text-align: center;
	}

	.track-list .headings .like {
		flex: 1;
	}

	.track-list .tracks {
		width: 100%;
		padding-top: 0.5rem;
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

	.track .title div {
		display: flex;
		flex-direction: column;
	}

	.track .title div .name {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.track .title div .name svg {
		margin-right: 0.25rem;
	}

	.track .title div .name p {
		width: calc(((100vw - 260px - 3rem) * 0.8 - 12px - 0.25rem));
		font-size: 12px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.track .title div .artist {
		width: calc(((100vw - 260px - 3rem) * 0.8));
		font-size: 12px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.title div .artist span:hover {
		text-decoration: underline;
	}

	.tracks .track .album p {
		width: calc(((100vw - 260px - 3rem) / 4 - 16px));
		font-size: 12px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
