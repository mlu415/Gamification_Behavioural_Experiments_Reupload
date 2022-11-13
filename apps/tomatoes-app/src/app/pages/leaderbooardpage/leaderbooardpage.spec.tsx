import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Leaderbooardpage from './leaderbooardpage';
import { ProfileContext } from '../../app';
import { auth } from 'libs/api-interfaces/src/firebase_config';

describe('Leaderbooardpage', () => {
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
            <Leaderbooardpage auth={auth} />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
