const clientId = '3609a08b358d4eef8a0990532897a53a';
const clientSecret = '95b0452b35434bd981a8e634e53aa3da';
const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const redirect_uri = 'http://localhost:3000/';

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
 * @description Очищение строки адреса после получения токена
 */
const handleRedirect = async () => {
  let code = getCode();
  window.history.pushState('', '', redirect_uri);
  await fetchAccessToken(code);
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
const onPageLoad = async () => {
  if (window.location.search.length > 0) {
    await handleRedirect();
  }
};
