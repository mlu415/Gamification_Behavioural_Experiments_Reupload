import { ScoreModel } from '../schema/schema.score';

/* DTO for Score */

export default class ScoreDTO {
  static async convertToDto(score: ScoreModel) {
    return {
      id: score._id,
      value: score.value,
      username: score.username,
    };
  }
}
