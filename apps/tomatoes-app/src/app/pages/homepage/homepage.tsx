//This page handles the rendering and routes to view the homepage.
//This page routes to login and register.

import { Button, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useNavigate } from 'react-router';
import bg from '../../assets/bg.png';
import styles from './homepage.module.scss';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles['homePageImage']}>
      <Container className={styles['centeredContainer']}>
        <Container className={styles['title']}>
          <Typography className={styles['t1']} variant="h2">
            Create behavioural experimental
          </Typography>
          <Typography className={styles['t2']} variant="h2">
            games and surveys
          </Typography>
          <Typography className={styles['t3']}>
            By playing these games and surveys, users can earn points which can
            be redeemed for coupons
          </Typography>
        </Container>

        <Container className={styles['buttonContainer']}>
          <Button
            className={styles['navLoginButton']}
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            className={styles['navRegisterButton']}
            variant="contained"
            onClick={() => navigate('/register')}
          >
            Signup
          </Button>
        </Container>
      </Container>
    </div>
  );
};

export default Homepage;
