import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import Experimenter from '../schema/schema.experimenter';
import UserDTO from '../dto/user';
import { AuthenticationRequest } from 'libs/api-interfaces/src/lib/AuthenticationRequest';

/* Controller for user that contains all of it's required functionality */

export const createUser = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body, user: authToken } = req;

  try {
    if (await Experimenter.findOne({ email: body.email }).exec()) {
      res
        .status(httpStatus.CONFLICT)
        .json({
          message: 'Account with given email already exists',
        })
        .end();
      return;
    }

    const newExperimenter = new Experimenter(await req.body);
    newExperimenter.auth = authToken;
    await newExperimenter.save();
    res.status(httpStatus.CREATED).json(UserDTO.convertToDto(newExperimenter));
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req, res) => {
  const { body, user: authToken } = req;

  try {
    // get the experimenter.
    const experimenter = await Experimenter.findOne({ auth: authToken });

    if (!authToken) {
      res.status(401).send('Need to be authenticated.').end();
    }

    if (!experimenter) {
      res.status(401).send('Authentication details are not valid.').end();
    }
    res.status(200).json(experimenter).end();
  } catch (e) {
    res.status(500).end();
  }
};

export const modifyUser = async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authToken = req.user;
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
    } else {
      const { body } = req;

      const result = await Experimenter.updateOne(
        { _id: loggedInUser._id },
        {
          $set: {
            email: body.email,
            profilePicture: body.profilePicture,
          },
        },
        { upsert: false }
      );
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );

      if (result) {
        res.status(200).send({ message: 'The profile has been updated.' });
      } else {
        res.status(500).send({ error: 'Failed to update the profile.' });
      }
    }
  } catch (e) {
    next(e);
  }
};
