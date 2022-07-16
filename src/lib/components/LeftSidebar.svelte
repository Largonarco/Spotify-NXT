<script>
</script>

<section class="left-sidebar">
	<div class="title-section">
		<h1>Spotify-NXT</h1>
	</div>

	<div class="list-section">
		<h2 class="list-section-heading">Menu</h2>
		<ul class="list-items">
			<a href="/home"
				><li class="list-item">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="currentColor"
						class="bi bi-house"
						viewBox="0 0 18 18">
						<path
							fill-rule="evenodd"
							d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
						<path
							fill-rule="evenodd"
							d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
					</svg>
					Home
				</li></a>
			<a href="/discover"
				><li class="list-item">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="currentColor"
						class="bi bi-search"
						viewBox="0 0 18 18">
						<path
							d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
					</svg>
					Search
				</li></a>
			<a href="/radio"
				><li class="list-item">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="currentColor"
						class="bi bi-broadcast"
						viewBox="0 0 18 18">
						<path
							d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
					</svg>Radio
				</li></a>
			<a href="/library"
				><li class="list-item">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="currentColor"
						class="bi bi-layers"
						viewBox="0 0 18 18">
						<path
							d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z" />
					</svg>Library
				</li></a>
		</ul>
	</div>

	<div class="list-section">
		<h2 class="list-section-heading">Playlists</h2>
		<ul class="list-items">
			<li class="list-item"><a href="/home">Home</a></li>
			<li class="list-item"><a href="/discover">Discover</a></li>
			<li class="list-item"><a href="/radio">Radio</a></li>
			<li class="list-item"><a href="/library">Library</a></li>
		</ul>
	</div>
</section>

<style>
	.left-sidebar {
		flex: 3;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 1rem;
		background-color: rgb(22, 22, 22);
		height: 100vh;
	}

	.title-section h1 {
		font-weight: 600;
		font-size: 24px;
	}

	.list-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.list-section-heading {
		font-weight: 400;
		font-size: 16px;
	}

	.list-items {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.list-item {
		font-weight: 200;
		font-size: 16px;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.list-item:hover {
		font-weight: 400;
	}
</style>
