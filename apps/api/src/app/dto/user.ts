import { ExperimenterModel } from '../schema/schema.experimenter';

/* DTO for User */

export default class UserDTO {
  static async convertToDto(user: ExperimenterModel) {
    return {
      email: user.email,
    };
  }
}
