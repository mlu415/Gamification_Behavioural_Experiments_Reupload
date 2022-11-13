//This page handles the logic for rendering the consent page, which is required for all surveys and data collection at the University of Auckland.

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Card,
  Container,
  Typography,
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Slide,
  List,
  ListItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';

import Snakegame from '../../components/snakegame/snakegame';
import styles from './consentpage.module.scss';
import { getDataNoAuth, getData } from '../../backend-functions/interface';
import { Game } from '../../components/game';
import { useLocation, useNavigate } from 'react-router-dom';
import consentImg from '../../../assets/consentimg.jpg';

const Gamepage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameInfo, setGameInfo] = useState({});
  const [gameFound, setGameFound] = useState(false);
  const [level, setLevel] = useState(1);

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
  const handleGameButton = () => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className={styles['background']}>
      <Card className={styles['navCard']}>
        <Container className={styles['imgContainer']}>
          <img className={styles['img']} src={consentImg} alt="consentIMG" />
        </Container>
        <Container className={styles['navContainer']}>
          <Container className={styles['navContainer']}>
            <Typography className={styles['title']}>Consent Form</Typography>
            <Typography className={styles['italic']}>
              Confirm you want to do this survey I have read the Participant
              information, and I have understood the nature of the research and
              why I have been selected.
            </Typography>
          </Container>
          <Container className={styles['consentContainer']}>
            <Typography className={styles['text']}>
              <List>
                <ListItem className={styles['list']}>
                  I have had the opportunity to ask questions and have them
                  answered to my satisfaction.
                </ListItem>
                <ListItem className={styles['list']}>
                  I agree to take part in this research.
                </ListItem>
                <ListItem className={styles['list']}>
                  I am aged 18 or older, and I am capable of giving informed
                  consent.
                </ListItem>
                <ListItem className={styles['list']}>
                  My participation is voluntary.
                </ListItem>
                <ListItem className={styles['list']}>
                  My decision to participate or not participate in this research
                  will not affect my grades or the relationship that I have with
                  the School of Psychology and the University of Auckland.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand that I have the right to withdraw my consent to
                  participate in this research at any time during the
                  data-collection phase without giving a reason. To withdraw I
                  must email the researcher with my unique ID.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand the research involves completing a short
                  electronic questionnaire.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand that the research involves playing a game for
                  about an hour.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand that the point amounts resulting from my choices
                  during the game will be converted into entries into a prize
                  draw after the game.
                </ListItem>
                <ListItem className={styles['list']}>
                  To enter the prize draw I must follow the link at the end of
                  the experiment and enter my unique ID.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand that the instructions for playing the game will
                  be presented to me before I play.
                </ListItem>
                <ListItem className={styles['list']}>
                  My data will be stored indefinitely under my participant ID
                  number.
                </ListItem>
                <ListItem className={styles['list']}>
                  If I wish to participate in another session of the game, I
                  should contact the researcher.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand that my identity will remain confidential, and I
                  will not be identifiable in any reporting or publications.
                </ListItem>
                <ListItem className={styles['list']}>
                  Consent forms collected electronically will be de-identified
                  and stored in a password-protected folder.
                </ListItem>
                <ListItem className={styles['list']}>
                  I understand I can email the researcher to request a copy of
                  the findings from the study.
                </ListItem>
              </List>
              Approved by the University of Auckland Human Participants Ethics
              Committee on 29 May 2020 for three years. Reference Number 024538
            </Typography>
            <Container className={styles['buttonContainer']}>
              <Button
                className={styles['new-button']}
                variant="contained"
                onClick={handleGameButton}
              >
                I agree
              </Button>
            </Container>
          </Container>
        </Container>
      </Card>
    </div>
  );
};

export default Gamepage;
