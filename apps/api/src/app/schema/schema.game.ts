import mongoose, { Schema, model } from 'mongoose';

export interface GameModel extends mongoose.Document {
  gameName: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  link: string;
  description: string;
  completed: mongoose.Schema.Types.ObjectId;
  survey_end: string;
  items_a: mongoose.Schema.Types.ObjectId[];
  items_b: mongoose.Schema.Types.ObjectId[];
  score: mongoose.Schema.Types.ObjectId[];
  levels: [
    {
      fps: number;
      duration: number;
      spawnRate: number;
      itemAChance: number;
      itemBChance: number;
      itemAMultiplier: number;
      itemBMultiplier: number;
      regionMultiplierX: number;
      regionMultiplierY: number;
    }
  ];
  gifs: mongoose.Schema.Types.ObjectId[];
}

/**
 * A schema for a game, with the games levels and references to images and gifssurvey
 */
const gameSchema = new Schema<GameModel>({
  gameName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Experimenter',
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  survey_end: {
    type: String,
    required: false,
  },
  items_a: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: false,
    },
  ],
  items_b: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: false,
    },
  ],
  score: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Score',
      required: false,
    },
  ],
  levels: {
    type: [
      {
        _id: false,
        fps: {
          type: Number,
          required: true,
          min: 1,
        },
        duration: {
          type: Number,
          required: true,
          min: 0,
        },
        spawnRate: {
          type: Number,
          required: true,
          min: 0,
        },
        itemAChance: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        itemBChance: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        itemAMultiplier: {
          type: Number,
          required: true,
          min: 0,
        },
        itemBMultiplier: {
          type: Number,
          required: true,
          min: 0,
        },
        regionMultiplierX: {
          type: Number,
          required: true,
          min: -5,
        },
        regionMultiplierY: {
          type: Number,
          required: true,
          min: -5,
        },
      },
    ],
    validate: (v: string | any[]) => Array.isArray(v) && v.length > 0,
  },
  gifs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gif',
      required: false,
    },
  ],
});

export default model<GameModel>('game', gameSchema);
