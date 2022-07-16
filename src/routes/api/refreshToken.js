import 'dotenv/config';

export const get = async ({ url }) => {
	const { CLIENT_ID, CLIENT_SECRET } = process.env;
	const refreshToken = url.searchParams.get('token');

	let res = await fetch(
		`https://accounts.spotify.com/api/token?refresh_token=${refreshToken}&grant_type=refresh_token`,
		{
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
	res = await res.json();

	return {
		body: res
	};
};
