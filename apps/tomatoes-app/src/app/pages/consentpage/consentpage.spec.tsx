import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsentPage from './consentpage';

describe('ConsentPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <ConsentPage />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
