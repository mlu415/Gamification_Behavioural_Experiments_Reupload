import { render, waitFor } from '@testing-library/react';
import VerificationPrompt from './verificationprompt';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { auth } from 'libs/api-interfaces/src/firebase_config';

describe('Verification prompt rendered', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <BrowserRouter>
        <VerificationPrompt open={true} message={''} close={() => (null)} functionality={() => (null)} />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
