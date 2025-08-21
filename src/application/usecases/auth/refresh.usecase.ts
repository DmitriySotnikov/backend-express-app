import httpStatus from 'http-status';
import { configService } from '../../../config/config.service';
import { JwtService } from '../../../infrastructure/jwt/jwt.service';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';
import { SessionDomainRepository } from '../../../domain/repositories/session.repositiry';
import { AuthDomainService } from '../../../domain/services/auth.service';

/**
 * @class RefreshUsecase
 * @description Use case for handling token refresh process.
 * Responsible for validating the refresh token, finding the user and session,
 * and generating new access and refresh tokens.
 */
export class RefreshUsecase {
  /**
   * @description Authentication domain service for token generation.
   * @private
   * @type {AuthDomainService}
   */
  private authDomainService: AuthDomainService;

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
   * @description Creates an instance of RefreshUsecase.
   * @param {AuthDomainService} authDomainService - Service for authentication domain operations.
   * @param {JwtService} jwtService - Service for JWT token operations.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   * @param {SessionDomainRepository} sessionRepository - Repository for session domain operations.
   */
  constructor(
    authDomainService: AuthDomainService,
    jwtService: JwtService,
    userRepository: UserDomainRepository,
    sessionRepository: SessionDomainRepository,
  ) {
    this.authDomainService = authDomainService;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  /**
   * @description Executes the token refresh process.
   * @param {Object} params - The parameters for token refresh.
   * @param {string} params.token - The refresh token to validate and replace.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} A new pair of tokens.
   * @throws {ApiError} If token is invalid, user not found, or session doesn't exist.
   */
  public async execute({
    token,
  }: {
    token: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify the token, throw unauthorized error if invalid
    const payload = this.jwtService.verifyJWT({
      token,
      secret: configService.get('JWT_SECRET'),
    });

    if (!payload) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    const { userId, deviceId } = payload;

    // Find user by ID, throw error if not found
    const user = await this.userRepository.getById({ id: userId });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
    }

    // Find session by user ID and device ID, throw unauthorized error if not found
    const session = await this.sessionRepository.findByUserIdAndDeviceId({
      deviceId,
      userId,
    });

    if (!session) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } =
      this.authDomainService.generateTokenPair(user, deviceId);

    // Manage user session with new refresh token
    await this.authDomainService.manageUserSession(
      user.id,
      newRefreshToken,
      deviceId,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
