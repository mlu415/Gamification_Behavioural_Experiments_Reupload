import { render, waitFor } from '@testing-library/react';
import RegisterPage from './registerpage';
import { BrowserRouter } from 'react-router-dom';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { act } from 'react-dom/test-utils';

describe('RegisterPage', () => {
  it('should render successfully', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <RegisterPage auth={auth} />
        </BrowserRouter>
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await waitFor(() => {});
  });
});
