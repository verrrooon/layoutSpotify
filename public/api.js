const clientId = '3609a08b358d4eef8a0990532897a53a';
const clientSecret = '95b0452b35434bd981a8e634e53aa3da';
const urlToken = 'https://accounts.spotify.com/api/token';

const getToken = async () => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    };

    try {
        const response = await fetch(urlToken, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: headers,
        });

        const token = await response.json();

        return token.access_token;
    } catch (err) {
        console.error('Error', err);
    }
};

const getArtists = async () => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
    };
};

console.log(getToken());

const token = getToken().then((data) => {
    console.log(data);
});