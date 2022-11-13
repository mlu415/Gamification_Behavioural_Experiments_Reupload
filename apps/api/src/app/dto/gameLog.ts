import { GameLogModel } from '../schema/schema.gameLog';

/* DTO for GameLog */

export default class GaneLogDTO {
  static async convertToDto(gameLog: GameLogModel) {
    return {
      id: gameLog._id,
      username: gameLog.username,
      game: gameLog.game,
      log: gameLog.log,
    };
  }
}
