//This page handles the logic of displaying all games created by the user
//Each games name, number of completed users are displayed, rendered in a grid with dynamic length.
//Routes to create and view game details are included
//You must be logged in to view games
//The url to this page is "games"

import styles from './gamelistpage.module.scss';
import Sidebar from '../../components/sidebar/sidebar';
import LoadingOverlay from '../../components/loadingoverlay/loadingoverlay';
import Signinprompt from '../../components/signinprompt/signinprompt';
import { useLocation, useNavigate } from 'react-router';
import {
  Card,
  Typography,
  Box,
  Button,
  Grid,
  LinearProgress,
  Slide,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { Auth } from 'firebase/auth';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import {
  getData,
  postData,
  deleteData,
} from '../../backend-functions/interface';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Game } from '../../components/game';

const Gamelistpage = (props: { auth: Auth }) => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [gameList, setGameList] = useState<Game[]>([]);
  const [loggedInUser, stateLoading] = useAuthState(props.auth);
  const [gamesFound, setGamesFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const alternatingColours = ['#e7e7e7', '#fbfcff'];

  const getGames = async () => {
    setLoading(true);
    const response = await getData(`games`);
    setLoading(false);
    if (response.status !== 200) {
      return;
    }
    const gameList: Game[] = [];
    for (const game of response.data) {
      gameList.push(game as Game);
    }
    setGameList(gameList);
    setGamesFound(true);
    return;
  };

  useEffect(() => {
    if (loggedInUser || !stateLoading) {
      console.log(loggedInUser?.email);
      getGames();
    }
  }, [loggedInUser, stateLoading]);

  const handleCreateNewGame = async () => {
    navigate('/game/create', { state: { direction: 'left' } });
  };

  const handleViewDetails = (index: number) => {
    const gameID = gameList[index].id;
    navigate(`/game/${gameID}/details`, { state: { direction: 'left' } });
  };

  return (
    <div className={styles['background']}>
      <Signinprompt auth={auth} />
      <Card className={styles['navCard']}>
        <Sidebar />
        <Slide
          direction={state ? state.direction : 'right'}
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={state == null ? 0 : 500}
        >
          <Card className={styles['game-list-header']} raised={true}>
            <div className={styles['topDiv']}>
              <Typography className={styles['title']}> Games</Typography>
            </div>
            <Grid className={styles['grid-header']} container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="subtitle2" fontSize={32}>
                  {' '}
                  Name{' '}
                </Typography>
              </Grid>
              <Grid item xs={2} className={styles['list-padding-center']}>
                <Typography variant="subtitle2" fontSize={20}>
                  Completed{' '}
                </Typography>
              </Grid>
              <Grid item xs={2} className={styles['detail-button-container']}>
                <Button
                  className={styles['new-button']}
                  variant="contained"
                  onClick={handleCreateNewGame}
                >
                  + Create
                </Button>
              </Grid>
            </Grid>
            <div className={styles['lineDiv']}></div>
            {loading ? (
              <LinearProgress />
            ) : gamesFound ? (
              <div className={styles['scrollDiv']}>
                {gameList.map((data, index) => {
                  return (
                    <Grid
                      key={index}
                      className={styles['game-list-grid']}
                      container
                      spacing={2}
                      sx={{
                        backgroundColor: alternatingColours[index % 2],
                        '&:hover': {
                          backgroundColor: '#ccddff',
                        },
                      }}
                    >
                      <Grid className={styles['list-padding']} item xs={8}>
                        <Typography className={styles['list-text']}>
                          {data?.gameName || ''}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={2}
                        className={styles['list-padding-center']}
                      >
                        <Typography className={styles['completed-text']}>
                          {data?.score.length || '0'}
                        </Typography>
                      </Grid>

                      <Grid
                        className={styles['detail-button-container']}
                        item
                        xs={2}
                      >
                        <Button
                          className={styles['new-button']}
                          variant="contained"
                          onClick={() => {
                            handleViewDetails(index);
                          }}
                        >
                          Details
                        </Button>
                      </Grid>
                    </Grid>
                  );
                })}
              </div>
            ) : (
              <Typography className={styles['not-found']} variant="h6">
                No Games Added Yet
              </Typography>
            )}
          </Card>
        </Slide>
      </Card>
    </div>
  );
};

export default Gamelistpage;
