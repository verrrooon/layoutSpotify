const $rowList = document.querySelector('.content');
const $searchInput = document.querySelector('.header__search');

$searchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value;

    if (searchValue.length < 2) {
        [...$rowList.querySelectorAll('.hide')].forEach(($box) => $box.classList.remove('hide'));
        return;
    }

    [...$rowList.querySelectorAll('.box')].forEach(($box) => {
        const todoText = $box.querySelector('.title').textContent.toLowerCase();

        if (todoText.includes(searchValue)) {
            $box.classList.remove('hide');
        } else {
            $box.classList.add('hide');
        }
    });
});


const clientId = '3609a08b358d4eef8a0990532897a53a';
const clientSecret = '95b0452b35434bd981a8e634e53aa3da';
const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const redirect_uri = 'http://localhost:3000/';

let access_token = null;
let refresh_token = null;

const $albums = document.querySelector('#albums');
const $playlists = document.querySelector('#playlists');
const $musicans = document.querySelector('.final');

/**
 * Получение токена
 * @param {object} body - Тело запроса
 * @returns {object} - Результат запроса
 */
const getToken = async (body) => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: body,
            headers: headers,
        });

        return response.json();
    } catch (err) {
        console.error('Error', err);
    }
};

/**
 * Получение кода авторизации
 * @returns {string} - Код авторизации
 */
const getCode = () => {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
};

/**
 * @description Очищение строки адреса после получения токена
 */
const handleRedirect = () => {
    let code = getCode();
    window.history.pushState('', '', redirect_uri);
    fetchAccessToken(code);
};

/**
 * @description Перенаправление на страницу авторизации
 */
const requestAuthorization = () => {
    let url = AUTHORIZE;
    url += '?client_id=' + clientId;
    url += '&response_type=code';
    url += '&redirect_uri=' + encodeURI(redirect_uri);
    url += '&show_dialog=true';
    url +=
        '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-private';
    window.location.href = url;
};

/**
 * @description Очищение строки адреса при загрузке
 */
const onPageLoad = () => {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
};

/**
 * Получение авторизованного токена
 * @param {string} code - Код авторизации
 * @returns {object} - Токен
 */
const fetchAccessToken = async (code) => {
    let body = 'grant_type=authorization_code';
    body += '&code=' + code;
    body += '&redirect_uri=' + encodeURI(redirect_uri);
    body += '&client_id=' + clientId;
    body += '&client_secret=' + clientSecret;
    const token = await getToken(body);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    return token.access_token;
};

/**
 * Получение избранных плейлистов
 * @returns {object} - Результат запроса
 */
const refreshAccessToken = () => {
    refresh_token = localStorage.getItem('refresh_token');
    let body = 'grant_type=refresh_token';
    body += '&refresh_token=' + refresh_token;
    body += '&client_id=' + clientId;
    getToken(body);
};

const getAlbums = async () => {
    const limit = 6;
    access_token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}`,
            {
                method: 'GET',
                headers: headers,
            },
        );

        return response.json();
    } catch (err) {
        console.error('Error', err);
    }
};

getAlbums().then((data) => {

    data.playlists.items.forEach((item) => {
        const html = `<div class="box">
    <a class="link">
      <img class="box-image" src="${item.images[0].url}" alt="${item.name}" />
      <div class="title">${item.name}</div>
      <div class="description">Плейлист</div>
    </a>
  </div>`;
        $albums.insertAdjacentHTML('beforeend', html);
    });
});

/**
 * Получение плейлистов пользователя
 * @returns {object} - Результат запроса
 */
const getCurrentUserPlaylist = async () => {
    const limit = 6;
    access_token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
            method: 'GET',
            headers: headers,
        });

        return response.json();
    } catch (err) {
        console.error('Error', err);
    }
};

getCurrentUserPlaylist().then((data) => {
    data.items.forEach((item) => {
        const html = `<div class="box">
      <a class="link">
        <img class="box-image" src="${item.images.length !== 0 ? item.images[0].url : 'image/mood/1.jpg'
            }" alt="${item.name}" />
        <div class="title">${item.name}</div>
        <div class="description">${item.description}</div>
      </a>
    </div>`;
        $playlists.insertAdjacentHTML('beforeend', html);
    });
});

/**
 * Получение музыкантов
 * @returns {object} - Результат запроса
 */
const getMusicans = async () => {
    access_token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/artists?ids=3KtiWEUyKC5lgHedcN6y6C%2C3vvLuXEEf7sl3izJcw0GIn%2C5NipqMGsY4AUeb7kGT8aVz%2C1H1zBr7TXFwTwsHU5kX9gW%2C15UsOTVnJzReFVN1VCnxy4`,
            {
                method: 'GET',
                headers: headers,
            },
        );

        return response.json();
    } catch (err) {
        console.error('Error', err);
    }
};

getMusicans().then((data) => {
    data.artists.forEach((item) => {
        const html = `<div class="box">
    <a class="link">
      <img class="box-image musicians-image" src="${item.images[0].url}" alt="${item.name}" />
      <div class="title">${item.name}</div>
      <div class="description">Исполнитель</div>
    </a>
  </div>`;
        $musicans.insertAdjacentHTML('beforeend', html);
    });
});

/**
 * Получение id пользователя
 * @returns {object} - Результат запроса
 */
const getUserProfile = async () => {
    access_token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await fetch(`https://api.spotify.com/v1/me`, {
            method: 'GET',
            headers: headers,
        });

        const user = await response.json();

        return user.id;
    } catch (err) {
        console.error('Error', err);
    }
};

/**
 * Создание плейлиста
 * @returns {object} - Результат запроса
 */
const createDefaultPlaylist = async () => {
    access_token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    };
    const body = {
        name: 'New Playlist',
        description: 'New playlist description',
        public: false,
    };
    const id = await getUserProfile();

    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers,
        });

        return response.json();
    } catch (err) {
        console.error('Error', err);
    }
};
