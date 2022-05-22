import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Card from '../../components/Card';
import MainLayout from '../../layouts/MainLayout';
import BoxesLayout from '../../layouts/BoxesLayout';
import { ICard } from '../../types/ICard';
import { client_id, redirect_uri, api_uri, scope, headers } from '../../constants';

/**
 * @description Главная страница
 */
function Home() {
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState<ICard[]>([]);
  const [artists, setArtist] = useState<ICard[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<ICard[]>([]);

  /**
   * @description Получение токена доступа при клике
   */
  const handleClick = async () => {
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      ' ',
    )}&response_type=token&show_dialog=true`;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&')[0].split('=')[1];
      if (token) {
        window.location.hash = '';
        window.localStorage.setItem('access_token', token);
        setToken(token);
      }
    }
  }, [token]);

  useEffect(() => {
    /**
     * @description Получение плейлистов
     */
    const getFeaturedPlaylists = async () => {
      try {
        const playlists = await axios.get(
          `https://api.spotify.com/v1/browse/featured-playlists?limit=6`,
          {
            headers: headers,
          },
        );
        setPlaylists(playlists.data.playlists.items);
      } catch (error) {
        console.log(error);
      }
    };
    getFeaturedPlaylists();
  }, []);

  useEffect(() => {
    /**
     * @description Получение артистов
     */
    const getArtists = async () => {
      try {
        const playlists = await axios.get(
          `https://api.spotify.com/v1/artists?ids=15UsOTVnJzReFVN1VCnxy4%2C1H1zBr7TXFwTwsHU5kX9gW%2C3vvLuXEEf7sl3izJcw0GIn%2C3KtiWEUyKC5lgHedcN6y6C%2C5NipqMGsY4AUeb7kGT8aVz%2C46rVVJwHWNS7C7MaWXd842`,
          {
            headers: headers,
          },
        );
        setArtist(playlists.data.artists);
      } catch (error) {
        console.log(error);
      }
    };
    getArtists();
  }, []);

  useEffect(() => {
    /**
     * @description Получение плейлистов пользователя
     */
    const getUserPlaylists = async () => {
      try {
        const userPlaylists = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=6`, {
          headers: headers,
        });
        setUserPlaylists(userPlaylists.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    getUserPlaylists();
  }, []);

  return token ? (
    <MainLayout>
      <BoxesLayout heading="Только для тебя, Вероника">
        {playlists.map(({ id, name, description, images }) => {
          return <Card key={id} title={name} description={description} img={images[0].url} />;
        })}
      </BoxesLayout>
      <BoxesLayout heading="Только твоё" definition="Здесь найдется музыка для любого настроения.">
        {userPlaylists.map(({ id, name, description, images }) => {
          return (
            <Card
              key={id}
              title={name}
              description={description}
              img={images.length > 0 ? images[0].url : 'image/mood/5.jpg'}
            />
          );
        })}
      </BoxesLayout>
      <BoxesLayout heading="Популярные исполнители">
        {artists.map(({ id, name, images }) => {
          return (
            <Card
              key={id}
              title={name}
              description="Исполнитель"
              img={images[0].url}
              isMusician={true}
            />
          );
        })}
      </BoxesLayout>
    </MainLayout>
  ) : (
    <MainLayout>
      <div>Необходимо авторизоваться</div>
      <button className="profile" onClick={handleClick}>
        Войти
      </button>
    </MainLayout>
  );
}

export default Home;
