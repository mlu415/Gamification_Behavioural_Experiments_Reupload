//This page handles the logic of displaying the surveypage, after completing a game.
//The survey should be used for data collection of the expirementer.
//The survey is created on google forms, more information to embed the survey is included in the help page
//The URL to access this game is "surveypage"

import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Game } from '../../components/game';
import styles from './surveypage.module.scss';

/* eslint-disable-next-line */
export interface SurveyPageProps {}

export function SurveyPage(props: SurveyPageProps) {
  const location = useLocation();
  const [link, setLink] = useState('');

  useEffect(() => {
    if (location.state) {
      const survey = (location.state as Game).survey_end;
      if (survey != null) {
        setLink(survey);
      }
    }
  });

  return (
    <div className={styles['main-container']}>
      {link != '' ? (
        <iframe src={link} width="500" height="1000" frameBorder="0">
          Loading…
        </iframe>
      ) : (
        <div>error, please navigate to this place through a game</div>
      )}
    </div>
  );
}

export default SurveyPage;
