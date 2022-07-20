export const custom_fetch = async (url, method, body) => {
	const accessToken = localStorage.getItem('accessToken');

	let data = await fetch(url, {
		method,
		headers: [
			['Authorization', `Bearer ${accessToken}`],
			['Accept', 'application/json'],
			['Content-Type', 'application/json']
		],
		body
	});
	data = await data.json();

	return data;
};
