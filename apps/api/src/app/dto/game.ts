import { GameModel } from '../schema/schema.game';

/* DTO for Game */

export default class GameDTO {
  static async convertToDto(game: GameModel) {
    return {
      id: game._id,
      gameName: game.gameName,
      createdBy: game.createdBy,
      link: game.link,
      description: game.description,
      completed: game.completed,
      survey_end: game.survey_end,
      items_a: game.items_a,
      items_b: game.items_b,
      score: game.score,
      levels: game.levels,
      gifs: game.gifs,
    };
  }
}
