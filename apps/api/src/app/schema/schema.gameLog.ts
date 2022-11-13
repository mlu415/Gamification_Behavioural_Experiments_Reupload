import mongoose, { Schema, model } from 'mongoose';

export interface GameLogEntry {
  action: String,
  time: String,
  level: Number
}


export interface GameLogModel extends mongoose.Document {
  username: string;
  game: mongoose.Schema.Types.ObjectId;
  log: [GameLogEntry];
}


/**
 * A schema containing a log file for a single attempt of a game per instance
 */
const gameLogSchema = new Schema<GameLogModel>({
  username: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  log: {
    type: [{
      action: String,
      time: String,
      level: Number
    }],
    required: true,
  },
});


export default model<GameLogModel>('gameLog', gameLogSchema);
