import { render, waitFor } from '@testing-library/react';
import Editgamepage from './editgamepage';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { ProfileContext } from '../../app';

describe('Editgamepage', () => {
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
            <Editgamepage auth={auth} />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
