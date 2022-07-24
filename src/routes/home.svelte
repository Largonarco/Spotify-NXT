<script>
	import { onMount } from 'svelte/internal';
	import { spotify_fetch } from '../lib/utils/spotifyFetchFuncs';

	let recentlyPlayed = { items: [] };

	onMount(async () => {
		recentlyPlayed = await spotify_fetch(
			`https://api.spotify.com/v1/me/player/recently-played?limit=6`
		);
	});
</script>

<div class="home-page">
	<div class="recommendation-section">
		<h3 class="recommendation-section-title">Recently played</h3>

		<ul class="items-row">
			{#each recentlyPlayed.items as item}
				<li class="item">
					<a href="/playlist/{item.track.id}" class="card">
						<img class="card-img" src={item.track.album.images[1].url} alt={item.track.name} />
						<div class="card-desc">
							<h4 class="card-name">{item.track.name}</h4>
							<h5 class="card-info">
								{item.track.artists[0].name}
							</h5>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.home-page {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		background-color: #353535;
		overflow-y: auto;
		height: calc(100vh - 100px);
	}

	.recommendation-section {
		display: flex;
		flex-direction: column;
		margin-bottom: 2rem;
	}

	.recommendation-section-title {
		font-weight: 600;
		font-size: 18px;
		margin-bottom: 1rem;
	}

	.items-row {
		display: flex;
	}

	.item {
		max-width: calc((100% - 80px) / 6);
		margin-right: 1rem;
	}

	.item:last-of-type {
		margin-right: 0;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		background-color: #4d4d4d;
		border-radius: 0.5rem;
	}

	.card-img {
		width: 100%;
		border-radius: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.card-desc {
		width: 100%;
	}

	.card-name {
		font-weight: 600;
		font-size: 14px;
		margin-bottom: 0.25rem;
		margin-left: auto;
		margin-right: auto;
		width: calc(90%);
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.card-info {
		font-weight: 400;
		font-size: 14px;
		text-align: center;
	}
</style>
