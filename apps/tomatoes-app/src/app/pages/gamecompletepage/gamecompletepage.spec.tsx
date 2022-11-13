import { render } from '@testing-library/react';

import GameCompletePage from './gamecompletepage';

describe('Gamecompletepage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameCompletePage />);
    expect(baseElement).toBeTruthy();
  });
});
