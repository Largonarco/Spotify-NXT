import 'dotenv/config';

export const get = async ({ url }) => {
	const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
	const refreshToken = url.searchParams.get('refresh_token');

	let tokens = await fetch(
		`https://accounts.spotify.com/api/token?refresh_token=${refreshToken}&grant_type=refresh_token`,
		{
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
	tokens = await tokens.json();

	if (tokens.access_token) {
		return {
			status: 200,
			body: tokens
		};
	} else {
		return {
			status: 502,
			body: { error: "Couldn't fetch tokens" }
		};
	}
};
