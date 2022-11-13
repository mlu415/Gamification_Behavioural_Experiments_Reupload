//This page is an exportable component, rendering a verification prompt.
//The verification text is passed as arguments, as defined in the props.

import styles from './verificationprompt.module.scss';
import { Backdrop, Typography, Card, Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export function VerificationPrompt(props: {
  message: string;
  open: boolean;
  close: any;
  functionality: any;
}) {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
      >
        <Card className={styles['centerCard']}>
          <Typography className={styles['verificationText']}>
            {props.message}
          </Typography>
          <div className={styles['buttonContainer']}>
            <Button
              className={styles['noButton']}
              onClick={props.close}
              variant="contained"
            >
              <CloseIcon className={styles['buttonIcon']} />
              No
            </Button>
            <Button
              className={styles['yesButton']}
              onClick={props.functionality}
              variant="contained"
            >
              <DoneIcon className={styles['buttonIcon']} />
              Yes
            </Button>
          </div>
        </Card>
      </Backdrop>
    </div>
  );
}

export default VerificationPrompt;
