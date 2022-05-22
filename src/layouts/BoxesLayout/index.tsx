import React, { ReactNode } from 'react';

import './BoxesLayout.css';

interface IProps {
  children: ReactNode;
  heading: string;
  definition?: string;
}

/**
 * @description Обертка для блока с карточками
 */
function BoxesLayout({ children, heading, definition }: IProps) {
  return (
    <div className="boxes">
      <div className="text">
        <h2 className="heading">{heading}</h2>
        <h3 className="definition">{definition}</h3>
      </div>
      <div className="row">{children}</div>
    </div>
  );
}

export default BoxesLayout;
