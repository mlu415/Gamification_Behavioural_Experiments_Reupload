import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Submitemailpage from './submitemailpage';

describe('Submitemailpage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Submitemailpage />
      </BrowserRouter>);
    expect(baseElement).toBeTruthy();
  });
});
