export const GET = async () => {
	const scope =
		'ugc-image-upload user-modify-playback-state user-read-playback-state user-read-currently-playing user-follow-modify user-follow-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read';

	return Response.redirect(
		`https://accounts.spotify.com/authorize?response_type=code&client_id=${
			import.meta.env.VITE_CLIENT_ID
		}&scope=${scope}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`,
		302
	);
};
