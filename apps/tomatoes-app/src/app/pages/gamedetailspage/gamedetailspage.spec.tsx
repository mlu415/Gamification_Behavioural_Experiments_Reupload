import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import GameDetailsPage from './gamedetailspage';
import { ProfileContext } from '../../app';

describe('Gamedetailspage', () => {
  it('should render successfully', async () => {
    act(() => {
      render(
        <ProfileContext.Provider
          value={{
            profilePic: 'pic',
            setProfilePic: (pic) => {
              console.log('set pic');
            },
          }}
        >
          <BrowserRouter>
            <GameDetailsPage auth={auth} />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
