//This page handles the logic of routing pages to their intended URLs.
//This page also passes global props to the rendered pages, such as the profile picture.

import React, { createContext, useState, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginPage from './pages/loginpage/loginpage';
import RegisterPage from './pages/registerpage/registerpage';
import HomePage from './pages/homepage/homepage';
import GamePage from './pages/gamepage/gamepage';
import EditGamePage from './pages/editgamepage/editgamepage';
import GameDetailsPage from './pages/gamedetailspage/gamedetailspage';
import Editaccountpage from './pages/editaccountpage/editaccountpage';
import Gamelistpage from './pages/gamelistpage/gamelistpage';
import Helppage from './pages/helppage/helppage';
import ConsentPage from './pages/consentpage/consentpage';
import Playerecordpage from './pages/playerrecordpage/playerrecordpage';
import PlayerListPage from './pages/playerlistpage/playerlistpage';
import Leaderbooardpage from './pages/leaderbooardpage/leaderbooardpage';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import SurveyPage from './pages/surveypage/surveypage';
import SubmitEmailPage from './pages/submitemailpage/submitemailpage';
import ProfilePicture from '../assets/default_profile.jpeg';
import { getData, SERVER_URL } from './backend-functions/interface';
import GameCompletePage from './pages/gamecompletepage/gamecompletepage';

export type ProfileContextType = {
  profilePic?: string;
  setProfilePic: (pic: string) => void;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

export const App = () => {
  const [profilePic, setProfilePic] = useState(ProfilePicture);
  const [loggedInUser, stateLoading, stateError] = useAuthState(auth);

  const getProfile = async () => {
    const response = await getData(`users`);
    if (response.data.profilePicture) {
      const imageResponse = await getData(
        `files/${response.data.profilePicture}`
      );
      if (imageResponse.status === 200) {
        setProfilePic(`${SERVER_URL}/files/${response.data.profilePicture}`);
      }
    }
  };

  useMemo(() => {
    if (loggedInUser && !stateLoading) {
      console.log('should not be called');
      getProfile();
    }
  }, [loggedInUser, stateLoading]);

  return (
    <ProfileContext.Provider value={{ profilePic, setProfilePic }}>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="register" element={<RegisterPage auth={auth} />} />
          <Route path="login" element={<LoginPage auth={auth} />} />
          <Route path="help" element={<Helppage />} />
          <Route path="games" element={<Gamelistpage auth={auth} />} />
          <Route path="game/create" element={<EditGamePage auth={auth} />} />
          <Route
            path="game/:gameId/edit"
            element={<EditGamePage auth={auth} />}
          />
          <Route
            path="game/:gameId/details"
            element={<GameDetailsPage auth={auth} />}
          />
          <Route
            path="account/edit"
            element={<Editaccountpage auth={auth} />}
          />
          <Route
            path="game/:gameId/record/:username"
            element={<Playerecordpage />}
          />
          <Route
            path="game/:gameId/playerlist"
            element={<PlayerListPage auth={auth} />}
          />
          <Route path="game/:gameId" element={<GamePage />} />
          <Route path="surveypage" element={<SurveyPage />} />
          <Route path="emailSubmit" element={<SubmitEmailPage />} />
          <Route
            path="game/:gameId/leaderboard"
            element={<Leaderbooardpage auth={auth} />}
          />
          <Route path="form/:gameId" element={<ConsentPage />} />
          <Route path="gameComplete" element={<GameCompletePage />} />
        </Route>
      </Routes>
    </ProfileContext.Provider>
  );
};

export default App;
