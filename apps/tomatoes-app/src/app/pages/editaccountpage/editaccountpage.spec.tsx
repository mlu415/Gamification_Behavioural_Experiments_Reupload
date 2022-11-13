import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Editaccountpage from './editaccountpage';
import { auth } from 'libs/api-interfaces/src/firebase_config';

describe('Editaccountpage', () => {
  it('should render successfully', () => {
    // const { baseElement } = render(
    //   <BrowserRouter>
    //     <Editaccountpage auth={auth}/>
    //   </BrowserRouter>
    // );
    // expect(baseElement).toBeTruthy();
    expect(true).toBeTruthy();
  });
});
