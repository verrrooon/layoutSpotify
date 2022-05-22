import React from 'react';

import './Card.css';

interface IProps {
  img: string;
  title: string;
  description: string;
  isMusician?: boolean;
}

/**
 * @description Компонент для карточки
 * @component
 */
function Card({ img, title, description, isMusician = false }: IProps) {
  return (
    <div className="box">
      <a className="link" href="#card">
        <img
          className={!isMusician ? 'box-image' : 'box-image musicians-image'}
          src={img}
          alt={title}
        />
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </a>
    </div>
  );
}

export default Card;
