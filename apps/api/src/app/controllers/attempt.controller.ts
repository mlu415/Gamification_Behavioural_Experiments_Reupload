import httpStatus from 'http-status';
import Attempt from '../schema/schema.attempt';
import AttemptDTO from '../dto/attempt';
import Game from '../schema/schema.game';
import { ObjectId } from 'mongodb';

/* Controller for attempt that contains all of it's required functionality */

export const createAttempt = async (req, res) => {
  const { body } = req;
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
    const newAttempt = new Attempt(await req.body);
    await newAttempt.save();
    res
      .status(httpStatus.CREATED)
      .json(await AttemptDTO.convertToDto(newAttempt));
    return;
  } catch (err) {
    res.status(400).send(`Bad Request, please check input parameters`);
    return;
  }
};

export const getAllAttempts = async (req, res) => {
  const attempts = await Attempt.find({
    game: { $in: new ObjectId(req.params.id) },
  });
  res.status(200).send(attempts);
};
