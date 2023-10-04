export const ssr = false;
import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

export const load = async ({ fetch, params }) => {
	const album = await spotify_fetch(
		`https://api.spotify.com/v1/albums/${params.albumID}`,
		'GET',
		null,
		fetch
	);

	return {
		album
	};
};
