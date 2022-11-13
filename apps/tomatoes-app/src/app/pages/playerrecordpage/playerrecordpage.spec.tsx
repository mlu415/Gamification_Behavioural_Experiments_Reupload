import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Playerrecordpage from './playerrecordpage';
import { ProfileContext } from '../../app';

describe('Playerrecordpage', () => {
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
          <Playerrecordpage />
        </BrowserRouter>
      </ProfileContext.Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
