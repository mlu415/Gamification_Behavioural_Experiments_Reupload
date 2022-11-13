//This page handles the logic to render and view the leaderboard of players on a current game.
//The URL to access this page is "game/:gameID/leaderboard"

import styles from './leaderbooardpage.module.scss';
import Sidebar from '../../components/sidebar/sidebar';
import { useLocation, useNavigate } from 'react-router';
import { ScoreModel } from '../../../../../api/src/app/schema/schema.score';
import {
  Card,
  Typography,
  Box,
  Button,
  Grid,
  Slide,
  LinearProgress,
} from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingOverlay from '../../components/loadingoverlay/loadingoverlay';
import Backbutton from '../../components/backbutton/backbutton';
import { getData } from '../../backend-functions/interface';
import { useAuthState } from 'react-firebase-hooks/auth';
import Signinprompt from '../../components/signinprompt/signinprompt';
import { Auth } from 'firebase/auth';
import { auth } from 'libs/api-interfaces/src/firebase_config';

/* eslint-disable-next-line */
export interface LeaderbooardpageProps {}

export function Leaderbooardpage(props: { auth: Auth }) {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  // const [logs, setLogs] = useState<GameLogModel[]>([]);

  const [scores, setScores] = useState<ScoreModel[]>([]);

  const { gameId } = useParams();
  const [playersFound, setPlayersFound] = useState(false);
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [loading, setLoading] = useState(true);
  const alternatingColours = ['#e7e7e7', '#fbfcff'];

  async function fetchLogs() {
    setLoading(true);
    try {
      const response = await getData(`game/score/${gameId}`);
      response.data.sort(
        (firstItem: ScoreModel, secondItem: ScoreModel) =>
          secondItem.value - firstItem.value
      );
      setScores(response.data);
      if (response.data.length > 0) {
        setPlayersFound(true);
      }
    } catch (err) {
      setPlayersFound(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loggedInUser || !stateLoading) {
      fetchLogs();
    }
  }, [loggedInUser, stateLoading]);

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
          <Container className={styles['player-list-header']}>
            <div className={styles['topDiv']}>
              <Backbutton location={`/game/${gameId}/details`} />
              <Box className={styles['nameBox']}>
                <Typography
                  className={styles['title']}
                  align="center"
                  variant="h3"
                >
                  Players
                </Typography>
              </Box>
              <div className={styles['filler']} />
            </div>

            <Container className={styles['player-list-card']}>
              <Grid className={'grid-header'} container spacing={2}>
                <Grid item xs={9.5} id="heading-name">
                  <Typography
                    sx={{ fontWeight: 'bold', pr: 10 }}
                    variant="subtitle2"
                    fontSize={20}
                  >
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={2} id="heading-name">
                  <Typography
                    sx={{ textAlign: 'left', fontWeight: 'bold' }}
                    variant="subtitle2"
                    fontSize={20}
                  >
                    Score
                  </Typography>
                </Grid>
              </Grid>

              {loading ? (
                <LinearProgress />
              ) : playersFound ? (
                <div>
                  {scores.map((data, index) => {
                    return (
                      <Grid
                        key={index}
                        className={styles['player-list-grid']}
                        sx={{
                          backgroundColor: alternatingColours[index % 2],
                          '&:hover': {
                            backgroundColor: '#ccddff',
                          },
                        }}
                        container
                        spacing={2}
                      >
                        <Grid item className={styles['list-padding']} xs={4}>
                          <Typography className={styles['list-text']}>
                            {data.username}
                          </Typography>
                        </Grid>

                        <Grid item className={styles['list-padding']} xs={4}>
                          <Typography className={styles['list-text-score']}>
                            {data.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  })}
                </div>
              ) : (
                <Typography className={styles['not-found']} variant="h6">
                  No Players Found for Selected Game
                </Typography>
              )}
            </Container>
          </Container>
        </Slide>
      </Card>
    </div>
  );
}

export default Leaderbooardpage;
