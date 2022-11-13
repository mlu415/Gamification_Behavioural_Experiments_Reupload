import { render } from '@testing-library/react';
import Homepage from './homepage';
import { BrowserRouter } from 'react-router-dom';

describe('Homepage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
