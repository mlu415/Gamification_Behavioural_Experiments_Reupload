import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import LoginPage from './loginpage';
import { BrowserRouter } from 'react-router-dom';
import { auth } from 'libs/api-interfaces/src/firebase_config';

describe('LoginPage', () => {
  it('should render successfully', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <LoginPage auth={auth} />
        </BrowserRouter>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
