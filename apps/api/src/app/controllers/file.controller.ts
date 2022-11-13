import { createReadStream } from 'fs';
import httpStatus from 'http-status';
import { createModel } from 'mongoose-gridfs';
import mongoose from 'mongoose';

/* Controller for file that contains all of it's required functionality */

export const uploadFile = async (req, res): Promise<void> => {
  const images = createModel();

  images.write(
    {
      filename: req.files['image']['name'],
      contentType: req.files['image']['mimetype'],
    },
    createReadStream(req.files['image']['tempFilePath']),
    (error, file) => {
      if (error) {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: 'Failed to store the file.' });
      } else {
        res.status(httpStatus.CREATED).json({ id: file._id });
      }
    }
  );
};

export const downloadFile = async (req, res): Promise<void> => {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send('ID not valid.');
    return;
  }

  const images = createModel();
  images
    .read({ _id: id })
    .on('finish', () => res.status(httpStatus.OK))
    .on('error', (e) => {
      const notFound = e.message.includes('FileNotFound');
      res
        .status(
          notFound ? httpStatus.NOT_FOUND : httpStatus.INTERNAL_SERVER_ERROR
        )
        .send({
          error: notFound ? 'File not found.' : 'Failed to download the file.',
        });
    })
    .pipe(res);
};

export const removeFile = async (req, res): Promise<void> => {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send('ID not valid.');
    return;
  }

  const images = createModel();

  images.unlink({ _id: id }, (error) => {
    if (error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('File not found.');
    else res.status(httpStatus.OK).send();
  });
};
