import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import Experimenter from '../schema/schema.experimenter';
import Game from '../schema/schema.game';
import GameLog from '../schema/schema.gameLog';
import { AuthenticationRequest } from 'libs/api-interfaces/src/lib/AuthenticationRequest';
import GameLogDTO from '../dto/gameLog';

/* Controller for game log that contains all of it's required functionality */

export const getGameLog = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body } = req;
  const gameId = req.params.id;
  const uid = req.user;
  const experimenter = await Experimenter.findOne({ auth: uid });
  const game = await Game.findById({ _id: gameId });

  if (!body.username) {
    res.status(404).send('Missing the username field in the path parameter.');
    return;
  }

  if (!experimenter) {
    res.status(404).send('Could not find user');
    return;
  }

  try {
    if (game.createdBy.toString() !== experimenter._id.toString()) {
      res.status(404).send('You are not authorised to perform this action.');
      return;
    }
    const gamelog = await GameLog.findOne({
      game: gameId,
      username: body.username,
    });
    res.status(200).json(gamelog.log);
  } catch (err) {
    res
      .status(404)
      .send(
        `Could not find the log with GameId: ${gameId} & Username: ${body.username}. Please check the url.`
      );
  }
};

export const createLog = async (req, res) => {
  const { body, user: authToken } = req;
  const game = await Game.findOne({ id: body.game }).exec();
  if (!game) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({
        message: 'game not found',
      })
      .end();
    return;
  }
  try {
    const newGameLog = new GameLog(await req.body);
    await newGameLog.save();
    res
      .status(httpStatus.CREATED)
      .json(await GameLogDTO.convertToDto(newGameLog));
    return;
  } catch (err) {
    res.status(400).send(`Bad Request, please check input parameters`);
    return;
  }
};

export const getGameLogsByGame = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body } = req;
  const gameId = req.params.id;
  const uid = req.user;
  const experimenter = await Experimenter.findOne({ auth: uid });
  const game = await Game.findById({ _id: gameId });

  if (!experimenter) {
    res.status(404).send('Could not find user');
    return;
  }

  try {
    if (game.createdBy.toString() !== experimenter._id.toString()) {
      res.status(404).send('You are not authorised to perform this action.');
      return;
    }
    const gamelogs = await GameLog.find({
      game: gameId,
    });
    res.status(200).json(gamelogs);
  } catch (err) {
    res
      .status(404)
      .send(
        `Could not find logs with GameId: ${gameId}. Please check the url.`
      );
  }
};
