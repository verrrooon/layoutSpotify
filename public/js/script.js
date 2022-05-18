const clientId = '3609a08b358d4eef8a0990532897a53a';
const clientSecret = '95b0452b35434bd981a8e634e53aa3da';
const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const redirect_uri = 'http://localhost:3000/';

let access_token = null;
let refresh_token = null;

const $content = document.querySelector('.content');

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
 * @description Очищение строки адреса при загрузке и проверка, что токен получен
 */
const onPageLoad = () => {
  if (window.location.search.length > 0) {
    handleRedirect();
  }
  if (!access_token) {
    const html = `<h2 class="heading">Необходимо авторизоваться</h2>
    <button class="profile" onclick="requestAuthorization()">
    Войти
    <img class="profile-image" src="image/Play.png" alt="" />
  </button>`;
    $content.insertAdjacentHTML('afterbegin', html);
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
  window.location.reload();
  localStorage.setItem('refresh_token', token.refresh_token);
  return token.access_token;
};

/**
 * @description Обновление токена
 */
const refreshAccessToken = () => {
  refresh_token = localStorage.getItem('refresh_token');
  let body = 'grant_type=refresh_token';
  body += '&refresh_token=' + refresh_token;
  body += '&client_id=' + clientId;
  getToken(body);
};

/**
 * Создание блока с карточками
 * @param {string} content - Контент блока
 * @param {string} heading - Заголовок блока
 */
const createBox = (content, heading) => {
  const html = `<div class="boxes">
        <h2 class="heading">${heading}</h2>
        <div class="row">${content}</div>
        </div>`;
  $content.insertAdjacentHTML('beforeend', html);
};

/**
 * Отправление запроса
 * @param {string} url - Адрес запроса
 * @param {string} method - Метод запроса
 * @returns {object} - Результат запроса
 */
const request = async (url, method) => {
  access_token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
    });

    return response.json();
  } catch (err) {
    console.error('Error', err);
  }
};

/**
 * @description Получение избранных плейлистов
 */
const getAlbums = request(`https://api.spotify.com/v1/browse/featured-playlists?limit=6`, 'GET');

/**
 * @description Отображение избранных плейлистов
 */
const renderAlbums = () => {
  let html = [];
  getAlbums.then((data) => {
    data.playlists.items.forEach((item) => {
      html.push(`<div class="box">
      <a class="link">
        <img class="box-image" src="${item.images[0].url}" alt="${item.name}" />
        <div class="title">${item.name}</div>
        <div class="description">Плейлист</div>
      </a>
    </div>`);
    });
    createBox(html.join(''), 'Только для тебя');
  });
};

/**
 * @description Получение плейлистов пользователя
 */
const getCurrentUserPlaylist = request(`https://api.spotify.com/v1/me/playlists?limit=6`, 'GET');

/**
 * @description Отображение плейлистов пользователя
 */
const renderPlaylists = () => {
  let html = [];
  getCurrentUserPlaylist.then((data) => {
    data.items.forEach((item) => {
      html.push(`<div class="box">
      <a class="link">
        <img class="box-image" src="${item.images.length !== 0 ? item.images[0].url : 'image/mood/1.jpg'
        }" alt="${item.name}" />
        <div class="title">${item.name}</div>
        <div class="description">${item.description}</div>
      </a>
    </div>`);
    });
    createBox(html.join(''), 'Только твоё');
  });
};

/**
 * @description Получение музыкантов
 */
// const getMusicians = request(
//   `https://api.spotify.com/v1/artists?ids=3KtiWEUyKC5lgHedcN6y6C%2C3vvLuXEEf7sl3izJcw0GIn%2C5NipqMGsY4AUeb7kGT8aVz%2C1H1zBr7TXFwTwsHU5kX9gW%2C15UsOTVnJzReFVN1VCnxy4`,
//   'GET',
// );

/**
 * @description Отображение музыкантов
 */
// const renderMusicians = () => {
//   let html = [];
//   getMusicians.then((data) => {
//     data.artists.forEach((item) => {
//       html.push(`<div class="box">
//       <a class="link">
//         <img class="box-image musicians-image" src="${item.images[0].url}" alt="${item.name}" />
//         <div class="title">${item.name}</div>
//         <div class="description">Исполнитель</div>
//       </a>
//     </div>`);
//     });
//     createBox(html.join(''), 'Популярные исполнители');
//   });
// };

/**
 * @description Получение id пользователя
 */
const getUserProfile = request(`https://api.spotify.com/v1/me`, 'GET');

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
  const id = await getUserProfile.then((data) => data.id);

  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    });
    window.location.reload();
    return response.json();
  } catch (err) {
    console.error('Error', err);
  }
};

/**
 * @description Отображение результата всех запросов
 */
const renderContent = () => {
  if (localStorage.getItem('access_token') !== null) {
    renderAlbums();
    renderPlaylists();
    //renderMusicians();
  }
};

renderContent();
