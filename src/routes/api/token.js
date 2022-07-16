import 'dotenv/config';

export const get = async ({ url }) => {
	const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
	const code = url.searchParams.get('code');

	let res = await fetch(
		`https://accounts.spotify.com/api/token?code=${code}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
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
