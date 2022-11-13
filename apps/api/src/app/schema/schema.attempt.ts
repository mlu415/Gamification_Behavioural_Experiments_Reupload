import mongoose, { Schema, model } from 'mongoose';

export interface AttemptModel extends mongoose.Document {
  email: string;
  score: number;
  game: mongoose.Schema.Types.ObjectId;
}

/**
 * A schema for a completed game attempt to provide data needed to give out rewards
 */
const attemptSchema = new Schema<AttemptModel>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  score: {
    type: Number,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
});

export default model<AttemptModel>('attempt', attemptSchema);
