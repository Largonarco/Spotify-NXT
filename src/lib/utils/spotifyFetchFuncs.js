import { fetch_get } from './fetchFuncs';

export const getNewTokens = async () => {
	const refreshToken = localStorage.getItem('refreshToken');

	let newTokens = await fetch(`/api/refreshToken?token=${refreshToken}`);
	newTokens = await newTokens.json();

	if (newTokens.access_token) {
		localStorage.setItem('accessToken', newTokens.access_token);
	}
};

export const spotify_fetch_get = async (url) => {
	let data = await fetch_get(url);

	if (data.status === 401) {
		await getNewTokens();
		data = await fetch_get(url);
	}

	return data;
};
