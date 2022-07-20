export const custom_fetch = async (url, method, body) => {
	const accessToken = localStorage.getItem('accessToken');
	let data;

	try {
		data = await fetch(url, {
			method,
			headers: [
				['Authorization', `Bearer ${accessToken}`],
				['Accept', 'application/json'],
				['Content-Type', 'application/json']
			],
			body
		});
		data = await data.json();
	} catch (error) {
		data = { error: error.message };
	}

	return data;
};
