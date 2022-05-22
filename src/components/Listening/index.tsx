import React from 'react';

import './Listening.css';

/**
 * @description Компонент для плеера
 * @component
 */
function Listening() {
  return (
    <div className="listening">
      <div className="info">
        <img className="info-image" src="image/player/Right Song.png" alt="" />
      </div>
      <div className="listening-items">
        <div className="player">
          <img
            className="player-image listening-items-image"
            src="image/player/Skip left.png"
            alt=""
          />
          <img className="player-image listening-items-image" src="image/player/Play.png" alt="" />
          <img
            className="player-image listening-items-image"
            src="image/player/Skip right.png"
            alt=""
          />
        </div>
        <div>
          <img src="image/player/Player.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Listening;
