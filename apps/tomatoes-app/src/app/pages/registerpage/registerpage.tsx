//This page handles the logic of a fresh, new user registering to our application.
//The page uses firebase as the authentication backend.
//The user can log in with a google account
//The URL to this page is "register"

import styles from './registerpage.module.scss';
import { Link } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Backdrop,
  Button,
  Card,
  Container,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
  useAuthState,
} from 'react-firebase-hooks/auth';
import { signOut, Auth } from 'firebase/auth';
import { useNavigate } from 'react-router';
import '../../backend-functions/interface';
import { postData } from '../../backend-functions/interface';
import { off } from 'process';
import e from 'express';
import loginpic from '../../../assets/UI/login.jpg';

export function RegisterPage(props: { auth: Auth }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [enableSignUp, setEnableSignUp] = useState(false);
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(props.auth);
  const [createAccountError, setCreateAccountError] = useState('');

  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(props.auth);

  //on page load, signout current user
  useEffect(() => {
    if (loggedInUser) {
      signOut(props.auth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createUser = async () => {
    const userData = {
      email: loggedInUser?.email,
    };
    const response = await postData(`users`, userData);
    if (response.status === 201 || response.status === 409) {
      navigate('/games');
      return;
    }
    setCreateAccountError(response.message);
  };

  useEffect(
    () =>
      setEnableSignUp(
        Boolean(email) && Boolean(password) && password === passwordVerify
      ),
    [email, password, passwordVerify]
  );

  useEffect(() => {
    if (user || userGoogle) {
      createUser();
    }
  }, [navigate, user, userGoogle]);

  return (
    <div className={styles['background']}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || loadingGoogle}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card className={styles['imgContainer']}>
        <img className={styles['img']} src={loginpic} alt="login" />
      </Card>
      {/* <Container className={styles['loginContainer']}> */}
      <Card className={styles['centerCard']}>
        <Card className={styles['loginCard']}>
          <Typography className={styles['logInTypography']} variant="h3">
            Create an account
          </Typography>
          <TextField
            className={styles['formTextField']}
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <div className={styles['spacer']}></div>
          <TextField
            className={styles['formTextField']}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <div className={styles['spacer']}></div>
          <TextField
            className={styles['formTextField']}
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          ></TextField>
          <div className={styles['spacer']}></div>
          {error || errorGoogle || createAccountError ? (
            <Alert severity="error">
              {error?.message ??
                errorGoogle?.message ??
                createAccountError ??
                'There was an error, please try again.'}
            </Alert>
          ) : null}
          <Button
            className={styles['logInButton']}
            variant="contained"
            onClick={() => createUserWithEmailAndPassword(email, password)}
            disabled={!enableSignUp}
          >
            Sign up
          </Button>

          <h2> or </h2>

          <Button
            className={styles['signInWithGoogleButton']}
            variant="outlined"
            onClick={() => signInWithGoogle()}
          >
            <Avatar
              className={styles['googleIconAvatar']}
              src="../../assets/google_icon.png"
            />
            <Typography variant="button">Continue with Google</Typography>
          </Button>
          <Link className={'resetPasswordTypography'} to="/login">
            <Typography className={styles['resetPasswordTypography']}>
              Already have an account? Log in
            </Typography>
          </Link>
        </Card>
      </Card>
    </div>
  );
}

export default RegisterPage;
