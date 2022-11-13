import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { defaultGame } from '../game';

import Snakegame from './snakegame';

describe('Snakegame', () => {
  it('should render successfully', () => {
    const level = 1;
    const { baseElement } = render(
      <BrowserRouter>
        <Snakegame
          gameInfo={defaultGame}
          level={level}
          updateLevel={() => level + 1}
        />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
