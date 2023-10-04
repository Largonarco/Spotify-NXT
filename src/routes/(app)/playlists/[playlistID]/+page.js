export const ssr = false;
import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

export const load = async ({ fetch, params }) => {
	const playlist = await spotify_fetch(
		`https://api.spotify.com/v1/playlists/${params.playlistID}`,
		'GET',
		null,
		fetch
	);

	return {
		playlist
	};
};
