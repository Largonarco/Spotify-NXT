import { custom_fetch } from './fetchFuncs';

export const getNewTokens = async () => {
	const refreshToken = localStorage.getItem('refreshToken');

	let newTokens = await fetch(`/api/refreshToken?token=${refreshToken}`);
	newTokens = await newTokens.json();

	if (newTokens.access_token) {
		localStorage.setItem('accessToken', newTokens.access_token);
	}
};

export const spotify_fetch = async (url, method = 'GET', body = null) => {
	let data = await custom_fetch(url, method, body);

	if (data?.error?.status === 401) {
		await getNewTokens();
		data = await custom_fetch(url, method, body);
	}

	return data;
};
