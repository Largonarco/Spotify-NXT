<script>
	import { onMount } from 'svelte/internal';
	import { spotify_fetch } from '../utils/spotifyFetch';

	let playlists = { items: [] };

	onMount(async () => {
		playlists = await spotify_fetch('https://api.spotify.com/v1/me/playlists');
	});

	const itemHighlighter = (e) => {
		document.querySelectorAll('#item').forEach((item) => {
			item.style.color = '#d9d9d9';
			item.style.fontWeight = 400;
		});

		e.target.style.color = '#b0e0ff';
		e.target.style.fontWeight = 600;
	};
</script>

<section class="left-sidebar">
	<h1 class="app-name">SpotifyNXT</h1>

	<div class="list">
		<h2 class="heading">Menu</h2>
		<ul class="items">
			<li class="item">
				<a id="item" href="/home" on:click={(e) => itemHighlighter(e)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-house icon"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
						<path
							fill-rule="evenodd"
							d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
					</svg>
					Home
				</a>
			</li>
			<li class="item">
				<a id="item" href="/discover" on:click={(e) => itemHighlighter(e)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-searc icon"
						viewBox="0 0 16 16">
						<path
							d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
					</svg>
					Search
				</a>
			</li>
			<li class="item">
				<a id="item" href="/radio" on:click={(e) => itemHighlighter(e)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-broadcast icon"
						viewBox="0 0 16 16">
						<path
							d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
					</svg>Radio
				</a>
			</li>
			<li class="item">
				<a id="item" href="/library" on:click={(e) => itemHighlighter(e)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-layers icon"
						viewBox="0 0 16 16">
						<path
							d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z" />
					</svg>Library
				</a>
			</li>
		</ul>
	</div>

	<div class="list">
		<h2 class="heading">Playlists</h2>
		<ul class="items">
			{#each playlists.items as playlist}
				<li class="item">
					<a href="/playlists/{playlist.id}">{playlist.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.left-sidebar {
		height: 100vh;
		min-width: 260px;
		max-width: 260px;
		padding: 1rem;
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: #002137;
	}

	.app-name {
		margin-bottom: 1.5rem;
		font-size: 24px;
		font-weight: 800;
		color: #b0e0ff;
	}

	.list {
		display: flex;
		flex-direction: column;
		margin-bottom: 2rem;
	}

	.list .heading {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.list .items {
		display: flex;
		flex-direction: column;
	}

	.list .items .item:not(.item:last-child) {
		margin-bottom: 0.75rem;
	}

	.list .items .item a {
		display: flex;
		align-items: center;
		font-size: 16px;
		font-weight: 400;
		color: #d9d9d9;
	}

	.list .items .item a:hover {
		color: #b0e0ff !important;
	}

	.list .items .item a .icon {
		margin-right: 1rem;
	}

	.list:last-child .items {
		height: calc(100vh - 9.75rem - 194px);
		overflow-y: auto;
	}

	.list:last-child .items .item a {
		width: calc(95%);
		font-size: 12px;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.list:last-child .items .item a:hover {
		color: #fff !important;
	}
</style>
