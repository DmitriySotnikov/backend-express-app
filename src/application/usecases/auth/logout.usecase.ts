import httpStatus from 'http-status';
import { configService } from '../../../config/config.service';
import { JwtService } from '../../../infrastructure/jwt/jwt.service';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';
import { SessionDomainRepository } from '../../../domain/repositories/session.repositiry';

/**
 * @class LogoutUsecase
 * @description Use case for handling user logout process.
 * Responsible for validating the refresh token, finding the user and session,
 * and removing the session from the system.
 */
export class LogoutUsecase {
  /**
   * @description JWT service for token verification.
   * @private
   * @type {JwtService}
   */
  private jwtService: JwtService;

  /**
   * @description Repository for user-related domain operations.
   * @private
   * @type {UserDomainRepository}
   */
  private userRepository: UserDomainRepository;

  /**
   * @description Repository for session-related domain operations.
   * @private
   * @type {SessionDomainRepository}
   */
  private sessionRepository: SessionDomainRepository;

  /**
   * @constructor
   * @description Creates an instance of LogoutUsecase.
   * @param {JwtService} jwtService - Service for JWT token operations.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   * @param {SessionDomainRepository} sessionRepository - Repository for session domain operations.
   */
  constructor(
    jwtService: JwtService,
    userRepository: UserDomainRepository,
    sessionRepository: SessionDomainRepository,
  ) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  /**
   * @description Executes the logout process for a user.
   * @param {Object} params - The parameters for logout.
   * @param {string} params.token - The refresh token to invalidate.
   * @returns {Promise<{ message: string }>} A message indicating successful logout.
   * @throws {ApiError} If token is invalid, user not found, or session doesn't exist.
   */
  public async execute({
    token,
  }: {
    token: string;
  }): Promise<{ message: string }> {
    // Verify the token, throw unauthorized error if invalid
    const payload = this.jwtService.verifyJWT({
      token,
      secret: configService.get('JWT_SECRET'),
    });

    if (!payload) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    const { userId, deviceId } = payload;

    // Find user by ID, throw unauthorized error if not found
    const user = await this.userRepository.getById({ id: userId });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    // Find session by user ID and device ID, throw unauthorized error if not found
    const session = await this.sessionRepository.findByUserIdAndDeviceId({
      deviceId,
      userId: user.id as number,
    });

    if (!session) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    // Delete the session
    await this.sessionRepository.delete({ id: session.id });

    return { message: 'Successfully logged out!' };
  }
}
