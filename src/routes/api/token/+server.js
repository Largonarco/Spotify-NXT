export const GET = async ({ url }) => {
	const { VITE_CLIENT_ID, VITE_CLIENT_SECRET, VITE_REDIRECT_URI } = import.meta.env;
	const code = url.searchParams.get('code');

	let res = await fetch(
		`https://accounts.spotify.com/api/token?code=${code}&redirect_uri=${VITE_REDIRECT_URI}&grant_type=authorization_code`,
		{
			method: 'POST',
			headers: {
				Authorization:
					'Basic ' + Buffer.from(VITE_CLIENT_ID + ':' + VITE_CLIENT_SECRET).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
	res = await res.json();

	return new Response(JSON.stringify(res));
};
