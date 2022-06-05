import { request } from './apiRequests.js';

const $content = document.querySelector('.content');

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
 * @description Отображение избранных плейлистов
 * @param {string} res - Результат запроса
 */
const renderAlbums = (res) => {
  let html = [];
  res.then((data) => {
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
 * @description Отображение плейлистов пользователя
 * @param {string} res - Результат запроса
 */
const renderPlaylists = (res) => {
  let html = [];
  res.then((data) => {
    data.items.forEach((item) => {
      html.push(`<div class="box">
      <a class="link">
        <img class="box-image" src="${
          item.images.length !== 0 ? item.images[0].url : 'image/mood/1.jpg'
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
 * @description Отображение результата всех запросов
 */
const renderContent = () => {
  if (localStorage.hasOwnProperty('access_token')) {
    const getCurrentUserPlaylist = request(
      `https://api.spotify.com/v1/me/playlists?limit=6`,
      'GET',
    );
    const getAlbums = request(
      `https://api.spotify.com/v1/browse/featured-playlists?limit=6`,
      'GET',
    );

    renderAlbums(getAlbums);
    renderPlaylists(getCurrentUserPlaylist);
  } else {
    const html = `<h2 class="heading">Необходимо авторизоваться</h2>
  <button class="profile" onclick="requestAuthorization()">
  Войти
  <img class="profile-image" src="image/Play.png" alt="" />
</button>`;
    $content.insertAdjacentHTML('afterbegin', html);
  }
};

renderContent();
