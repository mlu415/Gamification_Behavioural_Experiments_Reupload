//This page handles the logic of displaying the player list (number of players who have completed the game) of a certain game.
//The URL to access this page is "game/:gameID/playerlist"

import styles from './playerlistpage.module.scss';
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
import {
  GameLogEntry,
  GameLogModel,
} from '../../../../../api/src/app/schema/schema.gameLog';
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
import { CSVLink, CSVDownload } from 'react-csv';
import { database } from 'firebase-admin';
import { json } from 'body-parser';

/* eslint-disable-next-line */
export interface PlayerListPageProps {}

export function PlayerListPage(props: { auth: Auth }) {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<GameLogModel[]>([]);
  const { gameId } = useParams();
  const [playersFound, setPlayersFound] = useState(false);
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [loading, setLoading] = useState(true);
  const [outputData, setOutputData] = useState<
    {
      username: String;
      action: String;
      time: String;
      level: Number;
    }[]
  >([]);
  const [gameName, setGameName] = useState('loading');
  const alternatingColours = ['#e7e7e7', '#fbfcff'];

  async function fetchLogs() {
    setLoading(true);
    try {
      const response = await getData(`game/${gameId}/logsByGame`);
      setLogs(response.data);
      createDownload(response.data);

      if (response.data.length > 0) {
        setPlayersFound(true);
      }
    } catch (err) {
      setPlayersFound(false);
    }
    setLoading(false);
  }
  const getGameName = async () => {
    const response = await getData(`game/${gameId}`);
    console.log(response.data['gameName']);
    if (response) {
      setGameName(response.data['gameName']);
      console.log(gameName);
    }
    return;
  };

  async function createDownload(res: GameLogModel[]) {
    const records = res.reduce(
      (
        prevVal: {
          username: String;
          action: String;
          time: String;
          level: Number;
        }[],
        currentVal: GameLogModel
      ) =>
        prevVal.concat(
          currentVal.log.map((val: GameLogEntry) => ({
            username: currentVal.username,
            action: val.action,
            time: val.time,
            level: val.level,
          }))
        ),
      []
    );
    setOutputData(records);
    console.log(records);
  }

  useEffect(() => {
    if (loggedInUser || !stateLoading) {
      fetchLogs();
      getGameName();
    }
  }, [loggedInUser, stateLoading]);

  return (
    <div className={styles['background']}>
      <Signinprompt auth={auth} />
      <Card className={styles['navCard']}>
        <Sidebar />

        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={state == null ? 0 : 500}
        >
          <Container className={styles['game-list-header']}>
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

              <CSVLink data={outputData} filename={`${gameName} Player Logs`}>
                <Button
                  className={styles['download-button']}
                  variant="contained"
                >
                  Download All
                </Button>
              </CSVLink>
            </div>

            <Container className={styles['player-list-card']}>
              <Container className={styles['heading-name']}>
                <Typography variant="subtitle2" fontSize={20}>
                  Name
                </Typography>
              </Container>
              {loading ? (
                <LinearProgress />
              ) : playersFound ? (
                <div>
                  {logs.map((data, index) => {
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
                        <Grid item className={styles['list-padding']}>
                          <Typography className={styles['list-text']}>
                            {data.username}
                          </Typography>
                        </Grid>
                        <Grid item className={styles['list-padding']}>
                          <Button
                            className={styles['details-button']}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#3634ad',
                              },
                            }}
                            variant="contained"
                            onClick={() =>
                              navigate(
                                `/game/${gameId}/record/${data.username}`,
                                { state: { data } }
                              )
                            }
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

export default PlayerListPage;
