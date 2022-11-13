import styles from './gamedetailspage.module.scss';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Link,
  List,
  ListItem,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import Sidebar from '../../components/sidebar/sidebar';
import Signinprompt from '../../components/signinprompt/signinprompt';
import { Auth } from 'firebase/auth';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getData } from '../../backend-functions/interface';
import { useAuthState } from 'react-firebase-hooks/auth';
import Backbutton from '../../components/backbutton/backbutton';
import EditIcon from '@mui/icons-material/Edit';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AttemptModel } from '../../../../../api/src/app/schema/schema.attempt';

const GameDetailsPage = (props: { auth: Auth }) => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [gameName, setGameName] = useState('Loading');
  const [playersCompleted, setPlayersCompleted] = useState(0);
  const [averagePlayTime, setAveragePlayTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<AttemptModel[]>([]);
  const [surveyUrl, setSurveyUrl] = useState('');

  useEffect(() => {
    setSurveyUrl(
      `${
        !process.env['NODE_ENV'] || process.env['NODE_ENV'] === 'development'
          ? 'localhost:4200'
          : 'http://d390os3xijobxf.cloudfront.net'
      }/form/${gameId}`
    );
  }, [gameId]);

  //on page load, grab data
  useEffect(() => {
    if (loggedInUser || !stateLoading) {
      getGameData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser, stateLoading]);

  const getGameData = async () => {
    const response = await getData(`game/${gameId}`);
    if (response) {
      setGameName(response.data['gameName']);
    }

    const leaderboardRes = await getData(`attempts/${gameId}`);
    setLeaderboard(
      leaderboardRes.data
        .sort((a: AttemptModel, b: AttemptModel) => b.score - a.score)
        .slice(0, 5)
    );
    console.log(leaderboardRes.data);

    return;
  };

  const handleEditButton = () => {
    navigate(`/game/${gameId}/edit`, { state: { direction: 'left' } });
  };

  const handleViewPlayerDataButton = () => {
    navigate(`/game/${gameId}/playerlist`, { state: { direction: 'left' } });
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handlePlayDemoButton = () => {
    navigate(`/game/${gameId}`);
  };
  const handleSurveyButton = () => {
    navigate(`/form/${gameId}`);
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleShowLeaderboardButton = () => {
    navigate(`/game/${gameId}/leaderboard`, { state: { direction: 'left' } });
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
          <Container className={styles['navContainer']}>
            <div className={styles['topDiv']}>
              <Backbutton location="/games" />
              <Box className={styles['gameNameBox']}>
                <Typography
                  className={styles['title']}
                  align="center"
                  variant="h3"
                >
                  {gameName}
                </Typography>
              </Box>
              <Button
                className={styles['editButton']}
                variant="contained"
                onClick={handleEditButton}
              >
                <EditIcon className={styles['icon']} />
                Edit
              </Button>
            </div>
            <Container className={styles['gameDetailsCard']}>
              <div className={styles['lineDiv']}></div>
              <div className={styles['buttonsDiv']}>
              <Button
                  className={styles['viewPlayerDataButton']}
                  variant="outlined"
                  onClick={handleViewPlayerDataButton}
                >
                  View Players
                </Button>
                <Button
                  className={styles['showLeaderboardButton']}
                  variant="outlined"
                  onClick={handleShowLeaderboardButton}
                >
                  <LeaderboardIcon className={styles['icon']} />
                  Leaderboard
                </Button>
                <Button
                  className={styles['playDemoButton']}
                  variant="outlined"
                  onClick={handlePlayDemoButton}
                >
                  <PlayArrowIcon className={styles['icon']} />
                  Demo
                </Button>
                <Button
                  className={styles['playDemoButton']}
                  variant="outlined"
                  onClick={handleSurveyButton}
                >
                  Open Survey
                </Button>
              </div>

              <Typography className={styles['completedGameHeaderText']}>
                <div className={styles['top5Title']}>
                Top 5 players (order randomised):
                </div>
                <Stack>
                  {leaderboard.map((entry) => (
                    <Link href={`mailto:${entry.email}`} underline="hover" color="#000000">
                      {entry.email}
                    </Link>
                  ))}
                </Stack>
              </Typography>

              <Typography className={styles['surveyUrl']}>
                {"Survey link: "}
                <Link href={surveyUrl} underline="hover" color="#000000">{surveyUrl}</Link>
                <Button
                  className={styles['copyUrlButton']}
                  variant="outlined"
                  onClick={() => navigator.clipboard.writeText(surveyUrl)}
                >
                  Copy Survey URL
                </Button>
              </Typography>


            </Container>
          </Container>
        </Slide>
      </Card>
    </div>
  );
};

export default GameDetailsPage;
