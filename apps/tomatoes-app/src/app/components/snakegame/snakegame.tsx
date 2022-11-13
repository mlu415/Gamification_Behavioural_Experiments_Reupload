import styles from './snakegame.module.scss';
import { styled } from '@mui/material/styles';
import { getData } from '../../backend-functions/interface';
import { ScoreModel } from '../../../../../api/src/app/schema/schema.score';
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Card,
  Typography,
  ToggleButton,
  Button,
  Box,
  TextField,
  Stack,
  Grid,
  LinearProgress,
  Avatar,
} from '@mui/material';
import Board from './board/board';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Game } from '../../components/game';
import imageNotFound from '../../../assets/image_not_found.png';
import {
  patchData,
  postData,
  SERVER_URL,
} from '../../backend-functions/interface';
import { Container } from '@mui/system';
import { GameLogEntry } from 'apps/api/src/app/schema/schema.gameLog';
import { useNavigate } from 'react-router';
import Leaderboard from '../leaderboard/leaderboard';

/* eslint-disable-next-line */

export interface SnakegameProps {
  gameInfo: Game;
  level: number;
  startTime: number;
  updateLevel(currentLevel: number): any;
}

export function Snakegame(props: SnakegameProps) {
  const navigate = useNavigate();

  // Game state
  const { gameInfo, level, startTime, updateLevel } = props;
  const [score, setScore] = useState(0);
  const [completion, setCompletion] = useState(0);
  const [progressStyle, setProgressStyle] = useState({});
  const [play, setPlay] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [mute, setMute] = useState(false);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [sentData, setSentData] = useState(false);
  const [username, setUsername] = useState('');
  const [savedScore, setSavedScore] = useState(false);
  const [endSurvey, setEndsurvey] = useState(false);
  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState(false);
  const [scores, setScores] = useState<ScoreModel[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<ScoreModel[]>([]);

  // Loads game data such as GIFs and survey data.
  useEffect(() => {
    if (gameInfo) {
      if (gameInfo.survey_end) {
        setEndsurvey(true);
      }
      gameInfo.gifs.forEach(async (media) => {
        if (media) {
          const img = new Image();
          img.src = SERVER_URL + '/files/' + media;
        }
      });
      fetchScores();
    }
  }, [gameInfo]);

  // Game loop
  setTimeout(() => {
    if (completion < 100 && level <= gameInfo.levels.length) {
      setCompletion(completion + 1);
      const newStyle = { opacity: 1, width: `${completion}%` };
      setProgressStyle(newStyle);
    } else if (completion === 100 && level < gameInfo.levels.length) {
      setPlay(false);
      setTimeout(() => {
        setPlay(true);
        updateLevel(level);
        setCompletion(0);
      }, 2000);
    } else if (level === gameInfo.levels.length) {
      setGameComplete(true);
    }
  }, gameInfo.levels[level - 1].duration * 10);

  // Stores an email address as an 'attempt'.
  async function submitEmail() {
    if (email !== '') {
      setSavedEmail(true);
      const response = await postData('attempt', {
        email: email,
        score: score,
        game: gameInfo.id,
      });
      if (response.status !== 201) {
        setSavedEmail(false);
      } else {
        navigate('/gameComplete');
      }
    }
  }

  // Used to initialize the leaderboard scores.
  async function fetchScores() {
    try {
      const response = await getData(`game/score/${gameInfo.id}`);

      response.data.sort(
        (firstItem: ScoreModel, secondItem: ScoreModel) =>
          secondItem.value - firstItem.value
      );
      setScores(response.data);
      const leaderboad = response.data.slice();
      leaderboad.push({ value: 0, username: 'YOU' } as ScoreModel);
      setLeaderboardData(leaderboad);
    } catch (err) {
      console.log(err);
    }
  }

  // Fetch and update the leaderboard scores from the client side.
  function updateScore(newScore: number) {
    setScore(newScore);
    const newLeaderboardData = scores.slice();
    newLeaderboardData.push({ value: newScore, username: 'YOU' } as ScoreModel);
    newLeaderboardData.sort(
      (firstItem: ScoreModel, secondItem: ScoreModel) =>
        secondItem.value - firstItem.value
    );
    setLeaderboardData(newLeaderboardData);
  }

  // Sends the score to update the leaderboard in the database.
  async function saveScore() {
    if (!savedScore && username !== '') {
      setSentData(true);
      console.log(score);
      const response = await postData('score', {
        value: score,
        username: username,
      });
      if (response.status === 201) {
        gameInfo.score.push(response.data.id);
        patchData(`game/${gameInfo.id}`, gameInfo);
      }
    }
  }

  // Sends the player logs to the database.
  async function saveLogs() {
    if (!sentData && username !== '') {
      setSentData(true);
      postData('game/logs', {
        username: username,
        game: gameInfo.id,
        log: logs,
      });
    }
  }

  // Redirects to post game survey after the game ends.
  function navigateToPostGameSurvey() {
    localStorage.setItem('game', String(gameInfo.id));
    localStorage.setItem('score', String(score));
    if (gameInfo.survey_end) {
      window.location.href = gameInfo.survey_end;
    }
  }

  /**
   * The game is primarily composed of the
   * score card, game card, and the leaderboard.
   */
  return (
    <div className={styles['snake-game']}>
      <div className={styles['game-and-score']}>
        <Card className={styles['score-card']} raised={true}>
          <Typography variant="h5">Score: {score}</Typography>
          <div className={styles['sound-pane']}>
            <Typography variant="h5">LV {level}</Typography>
            <LinearProgress
              variant="determinate"
              value={completion}
              className={styles['progressBar']}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                className={styles['progressBarNumber']}
              >{`${Math.round(completion)}%`}</Typography>
            </Box>
            <ToggleButton
              className={styles['mute-button']}
              value="center"
              onClick={() => setMute(!mute)}
            >
              {mute ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </ToggleButton>
          </div>
        </Card>

        <Card className={styles['game-card']} raised={true}>
          {!gameComplete ? (
            play ? (
              <Board
                logs={logs}
                setLogs={setLogs}
                level={level}
                mute={mute}
                fps={gameInfo.levels[level - 1].fps}
                score={score}
                gameInfo={gameInfo}
                initTime={startTime}
                scoreSetter={updateScore}
              ></Board>
            ) : (
              <div>
                <img
                  className={styles['levelGif']}
                  src={
                    gameInfo.gifs[level - 1]
                      ? SERVER_URL + '/files/' + gameInfo.gifs[level - 1]
                      : imageNotFound
                  }
                  alt={imageNotFound}
                />
              </div>
            )
          ) : !endSurvey ? (
            <Container>
              <Typography
                className={styles['title']}
                align="center"
                variant="h5"
              >
                Thank you for completing this game. Enter your email and
                username below to win a reward!
              </Typography>
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
                <TextField
                  className={styles['outlined-basic']}
                  label="Username"
                  variant="outlined"
                  type="String"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={styles['small-container']}>
                <Button
                  className={styles['dataButton']}
                  variant="contained"
                  onClick={async () => {
                    await saveLogs();
                    await saveScore();
                    submitEmail();
                  }}
                  disabled={savedEmail}
                >
                  Submit
                </Button>
              </div>
            </Container>
          ) : (
            <Container>
              <Typography
                className={styles['title']}
                align="center"
                variant="h5"
              >
                Thank you for completing this game. Enter a username and
                complete the survey below to win a reward!
              </Typography>
              <div className={styles['small-container']}>
                <TextField
                  className={styles['outlined-basic']}
                  label="Username"
                  variant="outlined"
                  type="String"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={styles['small-container']}>
                <Button
                  className={styles['dataButton']}
                  variant="contained"
                  onClick={async () => {
                    await saveLogs();
                    await saveScore();
                    navigateToPostGameSurvey();
                  }}
                  disabled={sentData}
                >
                  Continue
                </Button>
              </div>
            </Container>
          )}
        </Card>
      </div>
      <Leaderboard leaderboardData={leaderboardData} />
    </div>
  );
}

export default Snakegame;
