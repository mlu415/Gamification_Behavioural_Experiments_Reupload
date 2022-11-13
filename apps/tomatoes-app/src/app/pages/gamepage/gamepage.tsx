//This page handles logic for rendering the game. Further details of the game logic is included in the snakegame folder in components.
//The url to access this game is "game/:gameID"

import React, { useEffect, useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import { useParams } from 'react-router';
import { Card, Typography } from '@mui/material';
import { Container } from '@mui/system';

import Snakegame from '../../components/snakegame/snakegame';
import styles from './gamepage.module.scss';
import { getDataNoAuth, getData } from '../../backend-functions/interface';
import { Game } from '../../components/game';

const Gamepage = () => {
  const { gameId } = useParams();
  const [gameInfo, setGameInfo] = useState({});
  const [gameFound, setGameFound] = useState(false);
  const [level, setLevel] = useState(1);
  const initTime = useMemo(() => new Date().getTime(), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getDataNoAuth(`game/${gameId}`);
        setGameInfo(data);
        setGameFound(true);
      } catch (err) {
        setGameFound(false);
      }
    }

    fetchData();
  }, [gameId]);

  return (
    <div className={styles['snake-game-container']}>
      {gameFound && (
        <Snakegame
          gameInfo={gameInfo as Game}
          level={level}
          startTime={initTime}
          updateLevel={(currentLevel: number) => setLevel(currentLevel + 1)}
        />
      )}
    </div>
  );
};

export default Gamepage;
