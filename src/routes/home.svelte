<script context="module">
	export const load = async ({ fetch, url }) => {
		const code = url.searchParams.get('code');

		let tokens = await fetch(`/api/token?code=${code}`);
		tokens = await tokens.json();

		return {
			props: {
				tokens
			}
		};
	};
</script>

<script>
	export let tokens;

	if (tokens && typeof window !== 'undefined') {
		localStorage.setItem('accessToken', tokens.access_token);
		localStorage.setItem('refreshToken', tokens.refresh_token);
	}
</script>
