import httpStatus from 'http-status';
import { User } from '../../../domain/entities/user.entity';
import { AllowedRoles } from '../../../infrastructure/constants';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { AuthDomainService } from '../../../domain/services/auth.service';
import { BcryptDomainService } from '../../../domain/services/bcrypt.service';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';
import { RoleRepository } from '../../../infrastructure/orm/repositories/role.repository';

/**
 * @class SignupUsecase
 * @description Use case for handling user registration process.
 * Responsible for checking user existence, hashing password,
 * validating roles, creating user, and generating authentication tokens.
 */
export class SignupUsecase {
  /**
   * @description Repository for user-related domain operations.
   * @private
   * @type {UserDomainRepository}
   */
  private userRepository: UserDomainRepository;

  /**
   * @description Bcrypt service for password hashing.
   * @private
   * @type {BcryptDomainService}
   */
  private bcryptService: BcryptDomainService;

  /**
   * @description Repository for role-related operations.
   * @private
   * @type {RoleRepository}
   */
  private roleRepository: RoleRepository;

  /**
   * @description Authentication domain service for token generation.
   * @private
   * @type {AuthDomainService}
   */
  private authDomainService: AuthDomainService;

  /**
   * @constructor
   * @description Creates an instance of SignupUsecase.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   * @param {BcryptDomainService} bcryptService - Service for password hashing.
   * @param {RoleRepository} roleRepository - Repository for role operations.
   * @param {AuthDomainService} authDomainService - Service for authentication domain operations.
   */
  constructor(
    userRepository: UserDomainRepository,
    bcryptService: BcryptDomainService,
    roleRepository: RoleRepository,
    authDomainService: AuthDomainService,
  ) {
    this.userRepository = userRepository;
    this.bcryptService = bcryptService;
    this.roleRepository = roleRepository;
    this.authDomainService = authDomainService;
  }

  /**
   * @description Executes the user registration process.
   * @param {Object} params - The parameters for user registration.
   * @param {string} params.firstname - User's first name.
   * @param {string} params.lastname - User's last name.
   * @param {string} params.surname - User's surname or middle name.
   * @param {string} params.birthDate - User's date of birth.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @param {string} params.deviceId - Unique identifier of the user's device.
   * @param {AllowedRoles[]} params.roleNames - Roles to be assigned to the user.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} A pair of authentication tokens.
   * @throws {ApiError} If user already exists, roles are invalid, or registration fails.
   */
  public async execute({
    firstname,
    lastname,
    surname,
    birthDate,
    email,
    password,
    deviceId,
    roleNames,
  }: {
    firstname: string;
    lastname: string;
    surname: string;
    birthDate: string;
    email: string;
    password: string;
    deviceId: string;
    roleNames: AllowedRoles[];
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.getByEmail({ email });

    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists!');
    }

    // Hash the password
    const hashPassword = await this.bcryptService.hash({
      password,
    });

    // Validate and retrieve roles
    const roles = await this.roleRepository.findByName({ names: roleNames });

    if (roles.length !== roleNames.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more roles not found');
    }

    // Create user domain model
    const userDomainModel = User.create({
      email,
      password: hashPassword,
      firstname,
      lastname,
      surname,
      birthDate,
      roles,
    });

    // Persist user in the repository
    const newUser = await this.userRepository.create({ user: userDomainModel });

    // Generate authentication token pair
    const { accessToken, refreshToken } =
      this.authDomainService.generateTokenPair(newUser, deviceId);

    // Manage user session with new refresh token
    await this.authDomainService.manageUserSession(
      newUser.id,
      refreshToken,
      deviceId,
    );

    return { accessToken, refreshToken };
  }
}
