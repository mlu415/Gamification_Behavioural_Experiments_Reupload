import httpStatus from 'http-status';
import Score from '../schema/schema.score';
import ScoreDTO from '../dto/score';

/* Controller for score that contains all of it's required functionality */

export const createScore = async (req, res) => {
  try {
    const newScore = new Score(await req.body);
    await newScore.save();
    res.status(httpStatus.CREATED).json(await ScoreDTO.convertToDto(newScore));
    return;
  } catch (err) {
    res.status(400).send(`Bad Request, please check input parameters`);
    return;
  }
};
