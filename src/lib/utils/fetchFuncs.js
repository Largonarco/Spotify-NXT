export const fetch_get = async (url) => {
	const accessToken = localStorage.getItem('accessToken');

	let data = await fetch(url, {
		method: 'GET',
		headers: [['Authorization', `Bearer ${accessToken}`]]
	});
	data = await data.json();

	return data;
};
