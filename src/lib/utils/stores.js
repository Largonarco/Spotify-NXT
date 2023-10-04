import { writable } from 'svelte/store';

export const playerParams = writable({
	songProgress: 0,
	songDuration: 0,
	item: null,
	contextURI: '',
	isPaused: true,
	shuffleState: false,
	repeatState: 0,
	volume: 50,
	deviceId: '',
	error: null
});

export const user = writable(null);
