//This page handles the logic for editaccount page, upon clicking the logo on the toolbar.
//It handles the logic for changing the profile picture, and changing password if you arent logged in with google.

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ProfilePicture from '../../../assets/default_profile.jpeg';
import styles from './editaccountpage.module.scss';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Snackbar,
  Typography,
  Slide,
} from '@mui/material';
import Sidebar from '../../components/sidebar/sidebar';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import {
  getData,
  postData,
  putData,
  SERVER_URL,
} from '../../backend-functions/interface';
import Signinprompt from '../../components/signinprompt/signinprompt';
import { ProfileContext, ProfileContextType } from '../../app';

/* eslint-disable-next-line */
export interface EditaccountpageProps {}

export function Editaccountpage(props: { auth: Auth }) {
  const { profilePic, setProfilePic } = useContext(
    ProfileContext
  ) as ProfileContextType;
  const [email, setEmail] = useState('');

  const onFileUpload = async (e: any) => {
    const data = new FormData();
    if (!e.target.files[0]) {
      return;
    }
    data.append('image', e.target.files[0], e.target.files[0].name);
    const response = await postData(`files`, data);
    if (response.status != 201) {
      return;
    }
    const editResponse = await putData(`users`, {
      profilePicture: response.data.id,
    });
    if (e.target.files[0] && editResponse.status === 200) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('Empty Password Field');
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [isEmailLogin, setIsEmailLogin] = useState(true);

  useEffect(() => {
    if (
      loggedInUser &&
      loggedInUser.providerData[0].providerId === 'google.com'
    ) {
      setIsEmailLogin(false);
    }
  }, [loggedInUser, stateLoading]);

  const submitPasswordAttempt = async () => {
    if (!isEmailLogin) {
      setText('Wrong Login Type');
      setOpen(true);
    } else if (newPassword === '' || newPasswordConfirm === '') {
      setText('Empty Password Field');
      setOpen(true);
    } else if (newPassword != newPasswordConfirm) {
      setText('Passwords are not Equal');
      setOpen(true);
    } else if (loggedInUser && loggedInUser.email) {
      const credential = EmailAuthProvider.credential(
        loggedInUser.email,
        oldPassword
      );
      try {
        await reauthenticateWithCredential(loggedInUser, credential);
        await updatePassword(loggedInUser, newPassword);
      } catch (err) {
        setText('Incorrect Password');
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles['background']}>
      <Card className={styles['navCard']}>
        <Sidebar />
        <Slide
          direction="right"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div className={styles['content']}>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: '100%' }}
              >
                {text}
              </Alert>
            </Snackbar>
            <Typography
              className={styles['editProfileTypography']}
              variant="h3"
            >
              Edit Profile
            </Typography>
            <Container className={styles['profileParentContainer']}>
              <Card className={styles['profilePictureCard']} raised={true}>
                <Typography
                  className={styles['profilePictureTypography']}
                  variant="h4"
                >
                  Profile Picture
                </Typography>
                <Avatar
                  className={styles['profilePictureAvatar']}
                  src={profilePic}
                  alt="ProfilePicture"
                />

                <div className={styles['center-child']}>
                  <Button
                    className={styles['uploadFileButton']}
                    variant="contained"
                    component="label"
                  >
                    Upload File
                    <input type="file" onChange={onFileUpload} hidden />
                  </Button>
                </div>
              </Card>
              {isEmailLogin ? (
                <Card className={styles['changePasswordCard']} raised={true}>
                  <Typography
                    className={styles['changePasswordTypography']}
                    variant="h4"
                  >
                    Change Password
                  </Typography>
                  <Box
                    component="form"
                    sx={{ width: '100%' }}
                    noValidate
                    autoComplete="off"
                  >
                    <Stack spacing={5} sx={{ width: '100%' }}>
                      <TextField
                        className={styles['outlined-basic']}
                        label="Current Password"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <TextField
                        className={styles['outlined-basic']}
                        label="New Password"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <TextField
                        className={styles['outlined-basic']}
                        label="Confirm New Password"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      />
                      {/* <div className={styles['centered']}> */}
                      <Button
                        className={styles['editButton']}
                        variant="contained"
                        onClick={submitPasswordAttempt}
                      >
                        Change password
                      </Button>
                      {/* </div> */}
                    </Stack>
                  </Box>
                </Card>
              ) : (
                <></>
              )}
            </Container>
          </div>
        </Slide>
      </Card>
    </div>
  );
}

export default Editaccountpage;
