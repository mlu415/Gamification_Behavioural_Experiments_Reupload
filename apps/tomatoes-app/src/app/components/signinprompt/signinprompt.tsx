import styles from './signinprompt.module.scss';
import { Backdrop, Typography, Card, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { Auth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router';

export function Signinprompt(props: { auth: Auth }) {
  const [open, setOpen] = React.useState(false);
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser || stateLoading) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [loggedInUser, stateLoading]);

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Card className={styles["centerCard"]}>
          <Typography className={styles["signInText"]}>You are not signed in.</Typography>
          <Button className={styles["sendLoginButton"]} onClick={() => navigate('/login')}>
            login
          </Button>
        </Card>
      </Backdrop>
    </div>
  );
}

export default Signinprompt;
