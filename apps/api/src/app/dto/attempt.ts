import { AttemptModel } from '../schema/schema.attempt';

/* DTO for Attempt */

export default class AttemptDTO {
  static async convertToDto(attempt: AttemptModel) {
    return {
      id: attempt._id,
      email: attempt.email,
      score: attempt.score,
      game: attempt.game,
    };
  }
}
