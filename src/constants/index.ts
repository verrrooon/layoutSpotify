export const client_id: string = '3609a08b358d4eef8a0990532897a53a';
export const redirect_uri = 'http://localhost:3000/';
export const api_uri = 'https://accounts.spotify.com/authorize';
export const scope = [
  'user-read-private',
  'user-read-email',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
];

const access_token = localStorage.getItem('access_token');
export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${access_token}`,
};