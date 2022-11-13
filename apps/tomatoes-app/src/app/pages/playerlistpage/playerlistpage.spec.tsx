import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Playerlistpage from './playerlistpage';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { ProfileContext } from '../../app';

describe('Playerlistpage', () => {
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
            <Playerlistpage auth={auth} />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
