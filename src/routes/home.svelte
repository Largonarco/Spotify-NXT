<script context="module">
	export const load = async ({ fetch, url }) => {
		const code = url.searchParams.get('code');

		let tokens = await fetch(`/api/token?code=${code}`);
		tokens = await tokens.json();

		if (!tokens.error) {
			return {
				props: {
					tokens
				}
			};
		} else {
			return {
				props: {
					tokens: null
				}
			};
		}
	};
</script>

<script>
	export let tokens;

	if (tokens && typeof window !== 'undefined') {
		localStorage.setItem('accessToken', tokens.access_token);
		localStorage.setItem('refreshToken', tokens.refresh_token);
	}
</script>

<section class="central-section" />

<style>
	.central-section {
		display: flex;
		flex: 15;
		padding: 1rem;
		background-color: rgba(22, 22, 22, 0.9);
		height: 100vh;
	}
</style>
