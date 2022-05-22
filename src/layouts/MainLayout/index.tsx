import React, { ReactNode } from 'react';

import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import Listening from '../../components/Listening';

import './MainLayout.css';

interface IProps {
  children: ReactNode;
}

/**
 * @description Обертка с основными компонентами и блоком для контента
 */
function MainLayout({ children }: IProps) {
  return (
    <>
      <Header />
      <Navigation />
      <div className="content">{children}</div>;
      <Listening />
    </>
  );
}

export default MainLayout;
