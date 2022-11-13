import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ProfileContext } from '../../app';
import Helppage from './helppage';

describe('Helppage', () => {
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
            <Helppage />
          </BrowserRouter>
        </ProfileContext.Provider>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
