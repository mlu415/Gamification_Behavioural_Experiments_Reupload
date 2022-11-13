import { render } from '@testing-library/react';

import Gamepage from './gamepage';

describe('Gamepage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Gamepage />);
    expect(baseElement).toBeTruthy();
  });
});
