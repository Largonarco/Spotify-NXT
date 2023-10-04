export const ssr = false;
import { spotify_fetch } from '../../../../lib/utils/spotifyFetch';

export const load = async ({ fetch, params }) => {
	const artist = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${params.artistID}`,
		'GET',
		null,
		fetch
	);
	const topTracks = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${params.artistID}/top-tracks?market=IN`,
		'GET',
		null,
		fetch
	);
	const popAlbums = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${params.artistID}/albums?limit=5`,
		'GET',
		null,
		fetch
	);
	const appearsOn = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${params.artistID}/albums?limit=5&include_groups=appears_on`,
		'GET',
		null,
		fetch
	);
	const compilations = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${params.artistID}/albums?limit=5&include_groups=compilation`,
		'GET',
		null,
		fetch
	);
	const similarArtists = await spotify_fetch(
		`https://api.spotify.com/v1/artists/${artist.id}/related-artists`,
		'GET',
		null,
		fetch
	);

	return {
		artist: {
			...artist,
			topTracks,
			popAlbums,
			appearsOn,
			compilations,
			similarArtists
		}
	};
};
