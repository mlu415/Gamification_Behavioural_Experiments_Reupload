//This page handles the logic of displaying a certain players completed record of his actions while he played a game to the expirementer.
//And is accessed through playerListPage
//This includes all actions, such as moving up, eating items, etc
//The URL to access the game is "game/:gameID/record/:username:"

import Sidebar from '../../components/sidebar/sidebar';
import styles from './playerrecordpage.module.scss';
import { Card, Typography, Box, Button, Grid, Slide } from '@mui/material';
import { Container } from '@mui/system';
import { useLocation, useNavigate, useParams } from 'react-router';
import Backbutton from '../../components/backbutton/backbutton';
import DownloadIcon from '@mui/icons-material/Download';
import { GameLogModel } from 'apps/api/src/app/schema/schema.gameLog';
import { useEffect, useState } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';

/* eslint-disable-next-line */
export interface PlayerrecordpageProps {}

export function Playerrecordpage(props: PlayerrecordpageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const alternatingColours = ['#e7e7e7', '#fbfcff'];
  interface locationState {
    data: GameLogModel;
  }
  const { gameId } = useParams();
  const [data, setData] = useState<GameLogModel>();

  useEffect(() => {
    if (location.state) {
      setData((location.state as locationState).data);
    }
  });

  return (
    <div className={styles['background']}>
      <Card className={styles['navCard']}>
        <Sidebar />
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Container className={styles['player-list-header']}>
            <div className={styles['topDiv']}>
              <Backbutton location={`/game/${gameId}/playerlist`} />
              <Box className={styles['nameBox']}>
                <Typography
                  className={styles['title']}
                  align="center"
                  variant="h3"
                >
                  {data ? data.username + "'s Record" : 'No Data'}
                </Typography>
              </Box>
              {data ? (
                <CSVLink
                  data={data.log}
                  filename={`${data.username} Player Log`}
                >
                  <Button
                    className={styles['download-button']}
                    variant="contained"
                  >
                    Download
                  </Button>
                </CSVLink>
              ) : null}
            </div>
            <Container className={styles['record-list-card']}>
              <Grid className={styles['header-grid']} container spacing={1}>
                <Grid item xs={2}>
                  <Typography variant="subtitle2">
                    Timestamp (mm:ss.ms)
                  </Typography>
                </Grid>
                <Grid item xs={8} className={styles['center-alignment']}>
                  <Typography variant="subtitle2">Action</Typography>
                </Grid>
                <Grid item xs={2} className={styles['center-alignment']}>
                  <Typography variant="subtitle2">Level</Typography>
                </Grid>
              </Grid>
              {data && Array.isArray(data.log) ? (
                <div>
                  {data.log.map((data, index) => {
                    return (
                      <Grid
                        key={index}
                        className={styles['action-list-container']}
                        sx={{
                          backgroundColor: alternatingColours[index % 2],
                        }}
                        container
                        spacing={2}
                      >
                        <Grid item xs={2}>
                          <Typography>{data.time}</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={8}
                          className={styles['center-alignment']}
                        >
                          <Typography>{data.action}</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          className={styles['center-alignment']}
                        >
                          <Typography>{String(data.level)}</Typography>
                        </Grid>
                      </Grid>
                    );
                  })}
                </div>
              ) : (
                <Typography className="not-found" variant="h6">
                  No Log Found
                </Typography>
              )}
            </Container>
          </Container>
        </Slide>
      </Card>
    </div>
  );
}

export default Playerrecordpage;
