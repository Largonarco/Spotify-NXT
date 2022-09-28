export const load = async ({ fetch, url }) => {
	const code = url.searchParams.get('code');

	let tokens = await fetch(`/api/token?code=${code}`);
	tokens = await tokens.json();

	return {
		tokens
	};
};
