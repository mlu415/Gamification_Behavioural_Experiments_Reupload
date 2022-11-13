import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Gamelistpage from './gamelistpage';
import { act } from 'react-dom/test-utils';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { ProfileContext } from '../../app';

describe('Signinprompt', () => {
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
            <Gamelistpage auth={auth} />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
