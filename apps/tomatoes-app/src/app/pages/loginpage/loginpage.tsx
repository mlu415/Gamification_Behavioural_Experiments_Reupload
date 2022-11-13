//This page handles the logic of a user logging in. The user should already exist on the database
//The URL to access this page is "login"

import styles from './loginpage.module.scss';
import { Link } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Backdrop,
  Button,
  Container,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from 'react-firebase-hooks/auth';
import { Auth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { postData, getData } from '../../backend-functions/interface';
import loginpic from '../../../assets/UI/login.jpg';

const LoginPage = (props: { auth: Auth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [password, setPassword] = useState('');
  const [enableSignIn, setEnableSignIn] = useState(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(props.auth);
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(props.auth);

  const [loginError, setLoginError] = useState('');

  useEffect(
    () => setEnableSignIn(Boolean(email) && Boolean(password)),
    [email, password]
  );

  const verifyLogin = async () => {
    const response = await getData(`users`);
    if (response.status === 200) {
      navigate('/games');
    }
    setLoginError(response.message);
  };

  useEffect(() => {
    if (user) verifyLogin();
    if (userGoogle) createUserGoogle();
  }, [navigate, user, userGoogle]);

  useEffect(() => {
    if (loggedInUser) {
      signOut(props.auth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //create user incase user signs in with google
  const createUserGoogle = async () => {
    const userData = {
      email: userGoogle?.user.email,
    };
    console.log('here');
    const response = await postData(`users`, userData);
    console.log(response);
    if (response.status === 201 || response.status === 409) {
      navigate('/games');
      return;
    }
    setLoginError(response.message);
  };

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
            Log In
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
          <Link to="/">
            <Typography className={styles['resetPasswordTypography']}>
              Forgot password? Reset your password
            </Typography>
          </Link>
          {error || errorGoogle || loginError ? (
            <Alert severity="error">
              {error?.message ??
                errorGoogle?.message ??
                loginError ??
                'There was an error, please try again.'}
            </Alert>
          ) : null}
          <Button
            className={styles['logInButton']}
            variant="contained"
            onClick={() => signInWithEmailAndPassword(email, password)}
            disabled={!enableSignIn}
          >
            Login
          </Button>
          <h2> or </h2>
          <Button
            className={styles['signInWithGoogleButton']}
            variant="outlined"
            onClick={() => signInWithGoogle()}
          >
            <Avatar
              className={styles['googleIconAvatar']}
              src="../../../assets/google_icon.png"
            />
            <Typography variant="button">Sign in with Google</Typography>
          </Button>
          <Link className={styles['centeredText']} to="/register">
            <Typography className={styles['resetPasswordTypography']}>
              Dont have an account? Sign up!
            </Typography>
          </Link>
        </Card>
      </Card>
    </div>
    // </Container>
  );
};

export default LoginPage;
