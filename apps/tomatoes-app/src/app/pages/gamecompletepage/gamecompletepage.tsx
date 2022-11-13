//This page handles the logic of displaying the congratulatory page upon finishing a game

import { Container, Card, Typography } from '@mui/material';
import styles from './gamecompletepage.module.scss';

/* eslint-disable-next-line */
export interface GamecompletepageProps {}

export function GameCompletePage(props: GamecompletepageProps) {
  return (
    <div className={styles['background']}>
      <Typography className={styles['t1']} variant="h2">
        Congratulations!
      </Typography>
      <Typography className={styles['t2']} variant="h2">
        You will receive an email with your reward
      </Typography>
    </div>
  );
}

export default GameCompletePage;
