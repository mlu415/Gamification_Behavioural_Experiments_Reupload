import mongoose, { Schema, model } from 'mongoose';

export interface ScoreModel extends mongoose.Document {
  value: number;
  username: string;
}

/**
 * A schema containing a log file for a single attempt of a game per instance
 */
const scoreSchema = new Schema<ScoreModel>({
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  username: {
    type: String,
    required: true,
  },
});

export default model<ScoreModel>('score', scoreSchema);
