<script>
	import { FastAverageColor } from 'fast-average-color';
	import { playerParams } from '../../../../lib/utils/stores';
	import { intervalToDuration, format, parseISO } from 'date-fns';
	import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

	export let data;
	$: isLiked = null;
	$: artist = data.artist;
	$: if (artist) {
		spotify_fetch(
			`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artist.id}`
		).then((val) => (isLiked = val[0]));
	}
	$: if (artist?.images[2].url) {
		const fac = new FastAverageColor();
		fac
			.getColorAsync(artist.images[2].url)
			.then(
				(avgColor) =>
					(document.getElementById(
						'artist'
					).style.background = `linear-gradient(180deg, ${avgColor.rgba}, 40%, rgb(0, 17, 28) 95% )`)
			);
	}

	const handleArtistPlay = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${$playerParams.deviceId}`,
					'PUT',
					{
						context_uri: artist.uri
					}
			  )
			: null;
	};

	const handleArtistPause = async () => {
		$playerParams.deviceId
			? await spotify_fetch(
					`https://api.spotify.com/v1/me/player/pause?device_id=${$playerParams.deviceId}`,
					'PUT'
			  )
			: null;
	};

	const handleArtistLike = async () => {
		await spotify_fetch(
			`https://api.spotify.com/v1/me/following?type=artist&ids=${artist.id}`,
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
						context_uri: artist.uri,
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

<div class="artist-page">
	{#if artist}
		<div class="artist" id="artist">
			<img class="image" src={artist.images[0].url} alt={artist.name} />

			<div class="info">
				<h3 class="name">{artist.name}</h3>
				<div class="stats">
					<div class="stat">
						<button on:click={handleArtistLike}>
							{#if isLiked}
								<svg
									width="20"
									height="20"
									fill="#ef233c"
									stroke="#ef233c"
									viewBox="-2 -2 20 20 "
									class="bi bi-heart-fill icon"
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
									class="bi bi-heart icon"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
								</svg>
							{/if}
						</button>
						<p class="text">{artist.followers.total.toLocaleString()} likes</p>
					</div>
				</div>
			</div>

			<div class="actions">
				{#if $playerParams.contextURI === `spotify:artist:${artist.id}` && !$playerParams.isPaused}
					<button class="play-button" style="margin-right: 1rem;" on:click={handleArtistPause}>
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
					<button class="play-button" style="margin-right: 1rem;" on:click={handleArtistPlay}>
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

		<div class="portfolio">
			<div class="popular-tracks">
				<h4 class="heading">Popular hits</h4>

				<div class="tracks">
					{#each artist.topTracks.tracks as track, index}
						<div class="track" on:click={() => handleIndividualTrackPlay(index)}>
							<div class="cover">
								<img class="img" src={track.album.images[2].url} alt={track.name} />
								<div>
									<p class="title">{track.name}</p>
								</div>
							</div>
							<div class="album-name"><p>{track.album.name}</p></div>
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
									class="bi bi-heart-fill"
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

			{#if artist.popAlbums.items.length !== 0}
				<div class="section latest-albums">
					<h4 class="head">Latest Albums</h4>

					<div class="body row albums">
						{#each artist.popAlbums.items as album}
							<div class="card album">
								<a href="/albums/{album.id}">
									<div class="cover" style="background-image: url({album.images[1].url});">
										<div class="info">
											<h4 class="title">{album.name}</h4>
											<div class="specifics">
												<h5 class="specific release-date">
													{album.release_date.slice(0, 4)}
												</h5>
												<h5 class="specific track-count">{album.total_tracks} tracks</h5>
											</div>
										</div>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if artist.appearsOn.items.length !== 0}
				<div class="section appeared-on-albums">
					<h4 class="head">Appears on</h4>

					<div class="body row albums">
						{#each artist.appearsOn.items as album}
							<div class="card album">
								<a href="/albums/{album.id}">
									<div class="cover" style="background-image: url({album.images[1].url});">
										<div class="info">
											<h4 class="title">{album.name}</h4>
											<div class="specifics">
												<h5 class="specific release-date">
													{album.release_date.slice(0, 4)}
												</h5>
												<h5 class="specific track-count">{album.total_tracks} tracks</h5>
											</div>
										</div>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if artist.compilations.items.length !== 0}
				<div class="section compiled-albums">
					<h4 class="head">Compilations</h4>

					<div class="body row albums">
						{#each artist.compilations.items as album}
							<div class="card album">
								<a href="/albums/{album.id}">
									<div class=" cover" style="background-image: url({album.images[1].url});">
										<div class="info">
											<h4 class="title">{album.name}</h4>
											<div class="specifics">
												<h5 class="specific release-date">
													{album.release_date.slice(0, 4)}
												</h5>
												<h5 class="specific track-count">{album.total_tracks} tracks</h5>
											</div>
										</div>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if artist.similarArtists.artists.length !== 0}
				<div class="section similar-artists">
					<h4 class="head">Similar artists</h4>

					<div class="body row artists">
						{#each artist.similarArtists.artists.slice(0, 5) as similarArtist}
							<div class="openable-card artist">
								<div
									class="outside cover"
									style="background-image: url({similarArtist.images[1].url});" />
								<a href="/artists/{similarArtist.id}">
									<h5 class="name">{similarArtist.name}</h5>
								</a>
								<h5 class="followers">
									{similarArtist.followers.total.toLocaleString()} followers
								</h5>
								<div class="genres">
									{#each similarArtist.genres.slice(0, Math.min(3, similarArtist.genres.length - 1)) as genre, index}
										<h6 class="genre">{genre}</h6>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="loader">
			<img src="/images/loader.svg" alt="Loader" />
		</div>
	{/if}
</div>

<style>
	.artist-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		background-color: #00111c;
	}

	.artist {
		position: relative;
		width: 100%;
		padding: 1.5rem;
		display: flex;
	}

	.artist .image {
		width: 200px;
		height: 200px;
		margin-right: 2rem;
		border-radius: 50%;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	.artist .info {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.artist .info .name {
		font-size: 44px;
		font-weight: 800;
		margin-bottom: 0.25rem;
	}

	.artist .info .stats {
		display: flex;
		align-items: center;
	}

	.info .stats .stat {
		margin-right: 1rem;
		display: flex;
		align-items: center;
	}

	.stats .stat .icon {
		margin-right: 0.5rem;
	}

	.artist .actions {
		position: absolute;
		bottom: 0;
		right: 1.5rem;
	}

	.artist .actions .play-button {
		padding: 1rem;
		color: black;
		border-radius: 50%;
		background-color: white;
	}

	.artist .actions .play-button:hover {
		transform: scale(1.05);
	}

	.portfolio {
		width: 100%;
		padding: 1.5rem;
		padding-bottom: 148px;
	}

	.portfolio .popular-tracks {
		width: 100%;
		margin-bottom: 3rem;
		display: flex;
		flex-direction: column;
	}

	.portfolio .popular-tracks .heading {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.popular-tracks .tracks {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.popular-tracks .tracks .track {
		width: 100%;
		margin: 0.5rem 0;
		display: flex;
	}

	.popular-tracks .tracks .track:hover {
		cursor: pointer;
	}

	.tracks .track .cover {
		flex: 8;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.track .cover .img {
		width: 48px;
		height: 48px;
		border-radius: 0.25rem;
		margin-right: 0.5rem;
	}

	.track .cover div {
		display: flex;
		flex-direction: column;
	}

	.track .cover div .title {
		width: calc(((100vw - 260px - 3rem) / 2 - 56px - 0.5rem));
		font-size: 12px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tracks .track .album-name {
		flex: 4;
	}

	.tracks .track .album-name p {
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

	.portfolio .section {
		width: 100%;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
	}

	.portfolio .section .head {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.portfolio .section .body {
		display: flex;
	}

	.section .body .card {
		width: calc((100vw - 260px - 7rem) / 5);
		margin-right: 1rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.089);
	}

	.section .body .card:last-of-type {
		margin-right: 0;
	}

	.body .card .cover {
		position: relative;
		width: calc(100%);
		aspect-ratio: 1;
		border-radius: 0.5rem;
		background-size: contain;
	}

	.card .cover .info {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		background: linear-gradient(180deg, transparent, 50%, black);
	}

	.cover .info .title {
		width: calc(95%);
		margin-right: auto;
		margin-bottom: 0.25rem;
		font-size: 14px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cover .info .specifics {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.info .specifics .track-count {
		font-size: 14px;
		font-weight: 400;
	}

	.info .specifics .release-date {
		font-size: 14px;
		font-weight: 400;
		margin-right: 0.5rem;
	}

	.section .body .openable-card {
		position: relative;
		width: calc((100vw - 260px - 7rem) / 5);
		margin-right: 1rem;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		perspective: 2000px;
		background-color: #1788e3;
		transform-style: preserve-3d;
		box-shadow: 1px 1px 12px #000;
	}

	.section .body .openable-card:last-of-type {
		margin-right: 0;
	}

	.body .openable-card .outside {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-size: contain;
		cursor: pointer;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border-radius: 50%;
		transform-origin: 0;
		transition: all 0.4s;
		box-shadow: 1px 1px 12px #000;
	}

	.body .openable-card:hover .outside {
		transform: rotatey(-80deg);
	}

	.openable-card .name {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #0d0d0d;
		text-align: center;
	}

	.openable-card .name:hover {
		text-decoration: underline;
	}

	.openable-card .followers {
		font-size: 12px;
		font-weight: 500;
		margin-bottom: 0.25rem;
		color: #0d0d0d;
	}

	.openable-card .genres {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.openable-card .genres .genre {
		margin-bottom: 0.25rem;
		text-transform: capitalize;
		border: 1px solid black;
		border-radius: 0.25rem;
		padding: 2px 4px;
		color: #404040;
		background-color: #b0e0ff;
		font-weight: 600;
	}

	.loader {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
