import { Router } from 'express';
import { decodeFirebaseIdToken, isAuthorized } from '../../utils/middleware';
import {
  createUser,
  getUser,
  modifyUser,
} from '../controllers/user.controller';
import {
  createGame,
  deleteGameById,
  getAllScores,
  getGame,
  getGames,
  modifyGame,
} from '../controllers/game.controller';
import {
  createLog,
  getGameLog,
  getGameLogsByGame,
} from '../controllers/gamelog.controller';
import fileUpload from 'express-fileupload';
import {
  downloadFile,
  removeFile,
  uploadFile,
} from '../controllers/file.controller';
import { createScore } from '../controllers/score.controller';
import {
  createAttempt,
  getAllAttempts,
} from '../controllers/attempt.controller';

const router = Router();

/*
USERS
*/
router
  .route('/users')
  .post(decodeFirebaseIdToken, isAuthorized, createUser)
  .put(decodeFirebaseIdToken, isAuthorized, modifyUser);

router.route('/users').get(decodeFirebaseIdToken, isAuthorized, getUser);

/*
GAME
*/
router.route('/game').post(decodeFirebaseIdToken, isAuthorized, createGame);
router.route('/game/:id').get(getGame);
router.route('/game/score/:id').get(getAllScores);
router.route('/games').get(decodeFirebaseIdToken, isAuthorized, getGames);
router
  .route('/game/:id')
  .patch(decodeFirebaseIdToken, isAuthorized, modifyGame);
router
  .route('/game/:id')
  .delete(decodeFirebaseIdToken, isAuthorized, deleteGameById);

/*
GAME LOGs
*/
router
  .route('/game/:id/logs')
  .get(decodeFirebaseIdToken, isAuthorized, getGameLog);
router
  .route('/game/:id/logsByGame')
  .get(decodeFirebaseIdToken, isAuthorized, getGameLogsByGame);
router.route('/game/logs').post(createLog);

router.route('/score').post(createScore);

/*
FILES
*/
router
  .use(fileUpload({ useTempFiles: true }))
  .route('/files')
  .post(decodeFirebaseIdToken, isAuthorized, uploadFile);

router
  .route('/files/:id')
  .get(downloadFile)
  .delete(decodeFirebaseIdToken, isAuthorized, removeFile);

/*
ATTEMPTS
*/
router.route('/attempt').post(createAttempt);

router
  .route('/attempts/:id')
  .get(decodeFirebaseIdToken, isAuthorized, getAllAttempts);

export default router;
