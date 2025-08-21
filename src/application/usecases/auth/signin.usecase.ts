import httpStatus from 'http-status';
import { AuthDomainService } from 'domain/services/auth.service';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { BcryptDomainService } from '../../../domain/services/bcrypt.service';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @class SigninUsecase
 * @description Use case for handling user sign-in process.
 * Responsible for validating user credentials, checking password,
 * and generating authentication tokens.
 */
export class SigninUsecase {
  /**
   * @description Authentication domain service for token generation.
   * @private
   * @type {AuthDomainService}
   */
  private authDomainService: AuthDomainService;

  /**
   * @description Bcrypt service for password comparison.
   * @private
   * @type {BcryptDomainService}
   */
  private bcryptService: BcryptDomainService;

  /**
   * @description Repository for user-related domain operations.
   * @private
   * @type {UserDomainRepository}
   */
  private userRepository: UserDomainRepository;

  /**
   * @constructor
   * @description Creates an instance of SigninUsecase.
   * @param {AuthDomainService} authDomainService - Service for authentication domain operations.
   * @param {BcryptDomainService} bcryptService - Service for password hashing and comparison.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   */
  constructor(
    authDomainService: AuthDomainService,
    bcryptService: BcryptDomainService,
    userRepository: UserDomainRepository,
  ) {
    this.authDomainService = authDomainService;
    this.bcryptService = bcryptService;
    this.userRepository = userRepository;
  }

  /**
   * @description Executes the user sign-in process.
   * @param {Object} params - The parameters for user sign-in.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @param {string} params.deviceId - Unique identifier of the user's device.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} A pair of authentication tokens.
   * @throws {ApiError} If user is not found, password is invalid, or authentication fails.
   */
  public async execute({
    email,
    password,
    deviceId,
  }: {
    email: string;
    password: string;
    deviceId: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // Find user by email, throw error if not found
    const user = await this.userRepository.getByEmail({ email });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
    }

    // Verify password, throw error if invalid
    const isValidPassword = await this.bcryptService.compare({
      password,
      hash: user.passwordForPersistence as string,
    });

    if (!isValidPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid password!');
    }

    // Generate authentication token pair
    const { accessToken, refreshToken } =
      this.authDomainService.generateTokenPair(user, deviceId);

    // Manage user session with new refresh token
    await this.authDomainService.manageUserSession(
      user.id,
      refreshToken,
      deviceId,
    );

    return { accessToken, refreshToken };
  }
}
