import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { ProfileContext } from '../../app';
import Sidebar from './sidebar';

describe('Sidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ProfileContext.Provider
        value={{
          profilePic: 'pic',
          setProfilePic: (pic) => {
            console.log('set pic');
          },
        }}
      >
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </ProfileContext.Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
