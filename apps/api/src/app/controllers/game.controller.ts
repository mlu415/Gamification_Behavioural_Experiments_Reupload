import Game from '../schema/schema.game';
import Score from '../schema/schema.score';
import Experimenter from '../schema/schema.experimenter';
import httpStatus from 'http-status';
import GameDTO from '../dto/game';

/* Controller for game that contains all of it's required functionality */

export const createGame = async (req, res) => {
  const { body, user: authToken } = req;
  if (!authToken) {
    res.status(httpStatus.BAD_REQUEST).send({
      'Error message': 'Auth token not provided',
    });
    return;
  }
  const loggedInUser = await Experimenter.findOne({ auth: authToken });
  body.createdBy = loggedInUser._id;
  if (!loggedInUser) {
    res.status(401).send({
      'Error message': 'Auth token invalid',
    });
    return;
  }
  if (loggedInUser._id.toString() != body.createdBy) {
    res.status(401).send({
      'Error message': 'Wrong Auth token',
    });
    return;
  }
  if (await Game.findOne({ link: body.link }).exec()) {
    res
      .status(httpStatus.CONFLICT)
      .json({
        message: 'game already exists',
      })
      .end();
    return;
  }
  try {
    const newGame = new Game(await req.body);
    await newGame.save();
    res.status(httpStatus.CREATED).json(await GameDTO.convertToDto(newGame));
    return;
  } catch (err) {
    res.status(400).send(`Bad Request, please check input parameters`);
    return;
  }
};

export const modifyGame = async (req, res) => {
  const { body, user: authToken } = req;
  try {
    const _id = req.params.id;
    const game = await Game.findOne({ _id: _id });

    if (!game) {
      res.status(404).send({
        'Error message': 'Game does not exist',
      });
      return;
    }

    if (!authToken) {
      res.status(httpStatus.BAD_REQUEST).send({
        'Error message': 'Auth token not provided',
      });
      return;
    }
    const loggedInUser = await Experimenter.findOne({ auth: authToken });
    if (!loggedInUser) {
      res.status(401).send({
        'Error message': 'Auth token invalid',
      });
      return;
    }

    if (String(loggedInUser._id) != String(game.createdBy)) {
      res.status(401).send({
        'Error message': 'Wrong Auth token',
      });
      return;
    }

    const result = await Game.updateOne(
      { _id: game._id },
      {
        $set: {
          gameName: body.gameName,
          link: body.link,
          description: body.description,
          completed: body.completed,
          survey_start: body.survey_start,
          survey_end: body.survey_end,
          items_a: body.items_a,
          items_b: body.items_b,
          score: body.score,
          levels: body.levels,
          gifs: body.gifs,
        },
      },
      { upsert: false }
    );
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );

    if (result) {
      res.status(200).send({ message: 'The game has been updated.' });
    } else {
      res.status(400).send({ error: 'Failed to update the game.' });
    }
  } catch (err) {
    res.status(400).send(`Bad Request, please check input`);
    console.log(err);
    return;
  }
};

export const getGame = async (req, res) => {
  let game;
  const gameId = req.params.id;

  // Check if a game id is provided.
  if (!gameId) {
    res.status(404).send('Missing the gameId field in the path parameter.');
    return;
  }

  // Find the game.
  try {
    game = await Game.findById({ _id: gameId });
  } catch (err) {
    res
      .status(404)
      .send(`Could not find the game ${gameId}. Please check the url.`);
    return;
  }

  if (game) {
    res.status(200).send(await GameDTO.convertToDto(game));
  } else {
    res
      .status(404)
      .send(`Could not find the game ${gameId}. Please check the url.`);
  }
};

export const getGames = async (req, res) => {
  const auth = req.user;
  try {
    // get the id for the experimenter.
    const experimenter = await Experimenter.findOne({ auth: auth });

    if (!auth) {
      res.status(401).send('Need to be authenticated.').end();
    }

    if (!experimenter) {
      res.status(401).send('Authentication details are not valid.').end();
    }

    // get the games that belong to the experimenter.
    const games = await Game.find({ createdBy: await experimenter._id });

    if (!games || games.length == 0) {
      res
        .status(404)
        .send('Could not find any games from the experimenter.')
        .end();
    } else {
      res
        .status(200)
        .json(
          await Promise.all(
            games.map(async (game) => GameDTO.convertToDto(game))
          )
        )
        .end();
    }
  } catch (e) {
    res.status(500).end();
  }
};

export const getAllScores = async (req, res) => {
  const gameId = req.params.id;

  try {
    const game = await Game.findById({ _id: gameId });
    if (!game) {
      res.status(404).send('Could not find game').end();
    }
    const foundScoresForGame = await Score.find({
      _id: { $in: game.score },
    });
    res.status(200).send(foundScoresForGame);
  } catch (e) {
    res.status(500).end();
  }
};

export const deleteGameById = async (req, res) => {
  const { body, user: authToken } = req;
  try {
    const _id = req.params.id;
    const game = await Game.findOne({ _id: _id });

    if (!game) {
      res.status(404).send('No game found');
      return;
    }

    if (!authToken) {
      res.status(httpStatus.BAD_REQUEST).send({
        'Error message': 'Auth token not provided',
      });
      return;
    }
    const loggedInUser = await Experimenter.findOne({ auth: authToken });
    if (!loggedInUser) {
      res.status(401).send({
        'Error message': 'Auth token invalid',
      });
      return;
    }

    if (String(loggedInUser._id) != String(game.createdBy)) {
      console.log('failed');
      res.status(401).send({
        'Error message': 'Wrong Auth token',
      });
      return;
    }

    const count = await Game.deleteOne({ _id: _id });
    if (count.deletedCount === 0) {
      res.status(404).send('Failed to delete the post.');
      return;
    }

    if (game) {
      res.status(200).send('Game has been deleted');
    } else {
      res
        .status(404)
        .send(`Could not delete game ${_id}. Please check the url.`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
