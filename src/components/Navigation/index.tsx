import React from 'react';

import './Navigation.css';

/**
 * @description Компонент для блока с навигацией
 * @component
 */
function Navigation() {
  return (
    <div className="navigation">
      <div className="logo">
        <img className="navigation-image logo-image" src="image/Logo.png" alt="logo" />
      </div>
      <ul className="tags">
        <li className="point">
          <a href="#main" className="tag">
            <img className="navigation-image" src="image/Home.png" alt="Главная" />
            Главная
          </a>
        </li>
        <li className="point">
          <a href="mediaLibrary" className="tag">
            <img className="navigation-image" src="image/Library small.png" alt="Моя медиатека" />
            Моя медиатека
          </a>
        </li>
      </ul>
      <ul className="playlist">
        <li className="point">
          <a className="link tag">
            <img className="navigation-image" src="image/Plus.png" alt="Создать плейлист" />
            Создать плейлист
          </a>
        </li>
        <li className="point">
          <a className="link tag">
            <img className="navigation-image" src="image/Like.png" alt="Любимые треки" />
            Любимые треки
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
