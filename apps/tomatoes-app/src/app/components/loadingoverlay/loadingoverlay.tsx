import styles from './loadingoverlay.module.scss';
import { Backdrop, Typography, Card, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';

export function LoadingOverlay(props: { status: boolean }) {
  const [open, setOpen] = React.useState(true);
  useEffect(() => {
    setOpen(props.status);
  }, [props.status]);

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Card className={styles['centerCard']}>
          <Typography className={styles['signInText']}>Loading...</Typography>
          <CircularProgress className={styles['centerLoadingBar']} />
        </Card>
      </Backdrop>
    </div>
  );
}

export default LoadingOverlay;
