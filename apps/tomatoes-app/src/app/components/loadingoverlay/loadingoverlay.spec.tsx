import { render } from '@testing-library/react';

import LoadingOverlay from './loadingoverlay';

describe('Loadingoverlay', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoadingOverlay status={true} />);
    expect(baseElement).toBeTruthy();
  });
});
