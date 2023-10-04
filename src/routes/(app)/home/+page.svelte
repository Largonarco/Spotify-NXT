<script>
	import { onMount } from 'svelte/internal';
	import { spotify_fetch } from '../../../lib/utils/spotifyFetch';

	let recentlyPlayed = { items: [] };

	onMount(async () => {
		recentlyPlayed = await spotify_fetch(
			`https://api.spotify.com/v1/me/player/recently-played?limit=6`
		);
	});

	$: console.log(recentlyPlayed);
</script>

<div class="home-page">
	<div class="section recently-played">
		<h4 class="head">Recently played</h4>

		<div class="body row items">
			{#each recentlyPlayed.items as item}
				<div class="card item">
					<a href="/playlist/{item.id}">
						<div class="cover" style="background-image: url({item.track.album.images[1].url});">
							<div class="info">
								<h4 class="title">{item.track.name}</h4>
								<div class="specifics">
									<a href="/artists/{item.track.artists[0].id}">
										<h5 class="specific artist-name">
											{item.track.artists[0].name}
										</h5>
									</a>
								</div>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.home-page {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		background-color: #00111c;
		overflow-y: auto;
		height: 100%;
	}

	.home-page .section {
		width: 100%;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
	}

	.home-page .section .head {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.home-page .section .body {
		display: flex;
	}

	.section .body .card {
		width: calc((100vw - 260px - 7rem) / 6);
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

	.info .specifics a {
		width: 100%;
	}

	.info .specifics .artist-name {
		width: calc(95%);
		font-size: 14px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info .specifics .artist-name:hover {
		text-decoration: underline;
	}
</style>
