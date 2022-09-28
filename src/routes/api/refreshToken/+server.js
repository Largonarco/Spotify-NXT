export const GET = async ({ url }) => {
	const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env;
	const refreshToken = url.searchParams.get('token');

	let res = await fetch(
		`https://accounts.spotify.com/api/token?refresh_token=${refreshToken}&grant_type=refresh_token`,
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
