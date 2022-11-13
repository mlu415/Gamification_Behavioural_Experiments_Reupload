import { render, waitFor } from '@testing-library/react';
import Signinprompt from './signinprompt';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { auth } from 'libs/api-interfaces/src/firebase_config';

describe('Signinprompt', () => {
  it('should render successfully', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signinprompt auth={auth} />
        </BrowserRouter>
      );
    });
    await waitFor(() => {});
  });
});
