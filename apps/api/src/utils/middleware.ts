import { NextFunction, Response } from 'express';
import firebaseAdmin from '../firebase/firebase-config';
import { AuthenticationRequest } from 'libs/api-interfaces/src/lib/AuthenticationRequest';

/* Functions used in the routes as middleware */

export const decodeFirebaseIdToken = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.headers.authorization) {
    res.status(400).json({
      error: {
        message: 'You did not specify any idToken for this request',
      },
    });
    return;
  }

  try {
    const idToken = req.headers.authorization.replace('Bearer ', '');
    const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = uid;
    next();
  } catch (error) {
    res.status(500).json({
      error,
    });
    return;
  }
};

export const isAuthorized = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      error: {
        message:
          'You are not authorised to perform this action. SignUp/Login to continue',
      },
    });
    return;
  }
};
