import { render } from '@testing-library/react';
import { defaultGame } from '../../game';
import Board from './board';

describe('Board', () => {
  let score = 0;
  it('should render successfully', () => {
    const { baseElement } = render(
      <Board
        fps={5}
        level={1}
        gameInfo={defaultGame}
        score={score}
        scoreSetter={(newScore) => (score = newScore)}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
