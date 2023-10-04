export const spotify_fetch = async (url, method = 'GET', body = null, customFetch = fetch) => {
	let data;
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	try {
		data = await customFetch(url, {
			method,
			headers: [
				['Authorization', `Bearer ${accessToken}`],
				['Accept', 'application/json'],
				['Content-Type', 'application/json']
			],
			body: body ? JSON.stringify(body) : body
		});
		data = await data.json();

		if (data?.error?.status === 401) {
			const res = await customFetch(`/api/refreshToken?token=${refreshToken}`);
			const { access_token } = await res.json();

			if (access_token) {
				data = await customFetch(url, {
					method,
					headers: [
						['Authorization', `Bearer ${access_token}`],
						['Accept', 'application/json'],
						['Content-Type', 'application/json']
					],
					body: body ? JSON.stringify(body) : body
				});
				data = await data.json();

				localStorage.setItem('accessToken', access_token);
			}
		}
	} catch (error) {
		data = { error: error.message };
	}

	return data;
};
