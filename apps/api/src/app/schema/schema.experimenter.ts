import mongoose, { Schema, model } from 'mongoose';

export interface ExperimenterModel extends mongoose.Document {
  email: string;
  auth: string;
  profilePicture: mongoose.Schema.Types.ObjectId;
}

/**
 * A schema for an experimenter, storing their information as well as firebase auth
 */

const experimenterSchema = new Schema<ExperimenterModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  auth: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: false,
  },
});

export default model<ExperimenterModel>('experimenter', experimenterSchema);
