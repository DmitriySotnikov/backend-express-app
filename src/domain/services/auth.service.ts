import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { configService } from '../../config/config.service';
import { JwtService } from '../../infrastructure/jwt/jwt.service';
import { rolesToString } from '../../infrastructure/utils/controller.utils';
import { SessionDomainRepository } from '../repositories/session.repositiry';

/**
 * @description Represents a pair of authentication tokens.
 * @typedef {Object} TokenPair
 * @property {string} accessToken - Short-lived token for accessing protected resources.
 * @property {string} refreshToken - Long-lived token used to obtain new access tokens.
 */
type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

/**
 * @class AuthDomainService
 * @description Domain service responsible for business logic related to
 * token creation and user session management.
 */
export class AuthDomainService {
  /**
   * @constructor
   * @description Creates an instance of AuthDomainService.
   * @param {JwtService} jwtService - Service for generating and verifying JWT tokens.
   * @param {SessionDomainRepository} sessionRepository - Repository for managing user sessions.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepository: SessionDomainRepository,
  ) {}

  /**
   * @description Generates a pair of access and refresh tokens for a user.
   * @param {User} user - The domain model of the user.
   * @param {string} deviceId - Unique identifier of the user's device.
   * @returns {TokenPair} An object containing access and refresh tokens.
   * @throws {Error} If token generation fails.
   */
  public generateTokenPair(user: User, deviceId: string): TokenPair {
    const rolesStr = rolesToString(user.roles);
    const userId = user.id as number;

    const refreshToken = this.jwtService.createToken({
      userId,
      roles: rolesStr,
      deviceId,
      time: configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const accessToken = this.jwtService.createToken({
      userId,
      roles: rolesStr,
      deviceId,
      time: configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  /**
   * @description Manages a user's session by either updating an existing session
   * or creating a new one if no session exists for the given user and device.
   * @param {number} userId - The unique identifier of the user.
   * @param {string} refreshToken - The generated refresh token.
   * @param {string} deviceId - Unique identifier of the user's device.
   * @returns {Promise<void>}
   * @throws {Error} If session management fails.
   */
  public async manageUserSession(
    userId: number,
    refreshToken: string,
    deviceId: string,
  ): Promise<void> {
    const existingSession =
      await this.sessionRepository.findByUserIdAndDeviceId({
        userId,
        deviceId,
      });

    if (!existingSession) {
      // Creating a new session
      const sessionDomainModel = Session.create({
        userId,
        refreshToken,
        deviceId,
      });
      await this.sessionRepository.create({ session: sessionDomainModel });
    } else {
      // Updating an existing session
      const updatedSession: Session =
        existingSession.updateRefreshToken(refreshToken);
      await this.sessionRepository.update({ session: updatedSession });
    }
  }
}
