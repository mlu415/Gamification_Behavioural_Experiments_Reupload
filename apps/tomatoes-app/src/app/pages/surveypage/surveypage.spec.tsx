import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import SurveyPage from './surveypage';

describe('SurveyPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <SurveyPage />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
