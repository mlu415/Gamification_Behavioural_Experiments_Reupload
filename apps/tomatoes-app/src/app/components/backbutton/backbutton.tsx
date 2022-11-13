//This page is a exportable backbutton, to be used on multiple pages

import { IconButton } from '@mui/material';
import styles from './backbutton.module.scss';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

/* eslint-disable-next-line */
export interface BackbuttonProps {}

export function Backbutton(props: { location: string }) {
  const navigate = useNavigate();

  return (
    <IconButton
      className={styles['BackButton']}
      onClick={() =>
        navigate(props.location, { state: { direction: 'right' } })
      }
    >
      <ArrowBackIcon sx={{ width: '40px', height: '40px' }} />
    </IconButton>
  );
}

export default Backbutton;
