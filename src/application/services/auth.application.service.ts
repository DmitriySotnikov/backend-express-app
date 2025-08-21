import {
  LogoutResponseDto,
  SignInDto,
  SignUpDto,
  SuccessAuthResponseDto,
} from '../../infrastructure/types/dto.types';
import { LogoutUsecase } from '../usecases/auth/logout.usecase';
import { SigninUsecase } from '../usecases/auth/signin.usecase';
import { SignupUsecase } from '../usecases/auth/signup.usecase';
import { RefreshUsecase } from '../usecases/auth/refresh.usecase';
import { TransactionManager } from '../../infrastructure/orm/typeorm/transaction.manager';

/**
 * @class AuthApplicationService
 * @description Application service for managing authentication-related operations.
 * Acts as an orchestrator for authentication use cases, providing a single entry point
 * for controllers and managing transactions.
 */
export class AuthApplicationService {
  /**
   * @constructor
   * @description Creates an instance of AuthApplicationService.
   * @param {TransactionManager} transactionManager - Manager for handling database transactions.
   * @param {SignupUsecase} signupUsecase - Use case for user registration.
   * @param {SigninUsecase} signinUsecase - Use case for user authentication.
   * @param {LogoutUsecase} logoutUsecase - Use case for user logout.
   * @param {RefreshUsecase} refreshUsecase - Use case for token refresh.
   */
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly signupUsecase: SignupUsecase,
    private readonly signinUsecase: SigninUsecase,
    private readonly logoutUsecase: LogoutUsecase,
    private readonly refreshUsecase: RefreshUsecase,
  ) {}

  /**
   * @description Orchestrates the process of registering a new user.
   * A critical operation that includes creating a user and session,
   * therefore executed within a single atomic transaction.
   * @param {SignUpDto} data - Data for user registration.
   * @returns {Promise<SuccessAuthResponseDto>} A pair of authentication tokens.
   * @throws {Error} If user registration fails or violates business rules.
   */
  public async signupUser(data: SignUpDto): Promise<SuccessAuthResponseDto> {
    return this.transactionManager.runInTransaction(() => {
      return this.signupUsecase.execute(data);
    });
  }

  /**
   * @description Orchestrates the process of user authentication.
   * @param {SigninData} data - User credentials.
   * @returns {Promise<SuccessAuthResponseDto>} A pair of authentication tokens.
   * @throws {Error} If authentication fails or credentials are invalid.
   */
  public async signinUser(data: SignInDto): Promise<SuccessAuthResponseDto> {
    return this.transactionManager.runInTransaction(() => {
      return this.signinUsecase.execute(data);
    });
  }

  /**
   * @description Orchestrates the process of refreshing authentication tokens.
   * @param {{ token: string }} data - Refresh token.
   * @returns {Promise<SuccessAuthResponseDto>} A new pair of authentication tokens.
   * @throws {Error} If token refresh fails or the refresh token is invalid.
   */
  public async refreshUserToken(data: {
    token: string;
  }): Promise<SuccessAuthResponseDto> {
    return this.transactionManager.runInTransaction(() => {
      return this.refreshUsecase.execute(data);
    });
  }

  /**
   * @description Orchestrates the process of user logout.
   * @param {{ token: string }} data - Refresh token for session invalidation.
   * @returns {Promise<LogoutResponseDto>} Message indicating successful logout.
   * @throws {Error} If logout process fails.
   */
  public async logoutUser(data: { token: string }): Promise<LogoutResponseDto> {
    return this.logoutUsecase.execute(data);
  }
}
