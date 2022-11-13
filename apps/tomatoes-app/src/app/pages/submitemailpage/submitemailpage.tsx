//This page handles the logic of an email submission entry, after completing a game
//This is linked towards reward redemption for the user, provided to by the experimenter
//The user should not be able to access this page without completing a game
//The URL to access this game is "emailSubmit"

import { Button, Card, Container, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { postData } from '../../backend-functions/interface';
import styles from './submitemailpage.module.scss';

/* eslint-disable-next-line */
export interface SubmitEmailPageProps {}

export function SubmitEmailPage(props: SubmitEmailPageProps) {
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [score, setScore] = useState('');
  const [game, setGame] = useState('');
  const [savedEmail, setSavedEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const game = localStorage.getItem('game');
    const score = localStorage.getItem('score');
    setValid(game != null && score != null);
    if (game != null && score != null) {
      setGame(game);
      setScore(score);
    }
  });

  async function submitEmail() {
    if (email != '') {
      setSavedEmail(true);
      const response = await postData('attempt', {
        email: email,
        score: score,
        game: game,
      });
      console.log(response);
      if (response.status === 201) {
        navigate('/gameComplete');
      } else {
        setSavedEmail(false);
      }
    }
  }

  return (
    <div className={styles['background']}>
      {valid ? (
        <div className={styles['validContent']}>
          <Typography className={styles['t1']} variant="h2">
            Thank you for completing this game.
          </Typography>
          <Typography className={styles['t2']} variant="h2">
            Enter your email below to win a reward!
          </Typography>
          <Card className={styles['centerCard']} raised={true}>
            <div>
              <div className={styles['small-container']}>
                <TextField
                  className={styles['outlined-basic']}
                  label="Email"
                  variant="outlined"
                  type="String"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles['small-container']}>
                <Button
                  className={styles['details-button']}
                  variant="contained"
                  onClick={() => {
                    submitEmail();
                  }}
                  disabled={savedEmail}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <h1>error, please navigate to this page through the game and survey</h1>
      )}
    </div>
  );
}

export default SubmitEmailPage;
