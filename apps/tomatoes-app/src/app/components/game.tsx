import { Level, defaultLevel } from './level';
import imageNotFound from '../../assets/image_not_found.png';

//this file defineds the type and default game values

export type Game = {
  id?: number;
  gameName: string;
  link?: string;
  description: string;
  completed: boolean;
  survey_end?: string;
  items_a: string[];
  items_b: string[];
  levels: Level[];
  gifs: string[];
  score: string[];
};

export const defaultGame = {
  gameName: 'New Game',
  // link has unique:true constraint
  description: 'words here again',
  completed: false,
  survey_end: '',
  items_a: [],
  items_b: [],
  levels: Array(5).fill(defaultLevel),
  gifs: [],
  score: [],
} as Game;
