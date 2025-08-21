import { User } from '../../domain/entities/user.entity';
import {
  UserListResponseDto,
  UserResponseDto,
} from '../../infrastructure/types/dto.types';

/**
 * @class UserPresenter
 * @description Responsible for transforming domain User models into safe DTOs for API responses.
 *
 * Key Responsibilities:
 * - Converts domain models to response DTOs
 * - Removes sensitive information (e.g., password hash)
 * - Provides methods for single user and user list transformations
 */
export class UserPresenter {
  /**
   * @description Transforms a single User domain model to a response DTO.
   * Extracts only the necessary and safe information for API response.
   *
   * @param {User} user - The domain model of the user to transform
   * @returns {UserResponseDto} A safe DTO representation of the user
   */
  public static toResponse(user: User): UserResponseDto {
    return {
      id: user.id as number,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      surname: user.surname,
      birthDate: user.birthDate,
      isBanned: user.isBanned,
      roles: user.roles.map((role) => ({
        id: role.id as number,
        name: role.name,
      })),
      createdAt: (user.createdAt as Date).toISOString(),
      updatedAt: (user.updatedAt as Date).toISOString(),
    };
  }

  /**
   * @description Transforms an array of User domain models to an array of response DTOs.
   * Useful for generating lists of users in API responses.
   *
   * @param {User[]} users - Array of user domain models to transform
   * @returns {UserListResponseDto []} An array of safe user DTOs
   */
  public static toListResponse(users: User[]): UserListResponseDto {
    return users.map(this.toResponse);
  }
}
