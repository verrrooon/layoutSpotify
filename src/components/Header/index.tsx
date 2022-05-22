import React from 'react';

import './Header.css';

/**
 * @description Компонент для header
 * @component
 */
function Header() {
  return (
    <header className="header">
      <div className="header-items">
        <div className="header-items__link">
          <a className="link" href="#back">
            <img src="image/ChevronLeft.png" alt="" />
          </a>
          <a className="link" href="#next">
            <img src="image/ChevronRight.png" alt="" />
          </a>
        </div>
        <div className="profile-buttons">
          <input type="search" className="header__search" placeholder="Search..." />
          <button className="profile">
            <img className="profile-image" src="image/musician/2.jpg" alt="" />
            Профиль
            <img className="profile-image" src="image/Play.png" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
