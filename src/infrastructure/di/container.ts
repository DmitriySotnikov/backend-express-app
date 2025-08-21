import { JwtService } from '../jwt/jwt.service';
import AppDataSource from '../orm/typeorm/data-source';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UserRepository } from '../orm/repositories/user.repository';
import { AuthDomainService } from '../../domain/services/auth.service';
import { TransactionManager } from '../orm/typeorm/transaction.manager';
import { SessionRepository } from '../orm/repositories/session.repository';
import { SigninUsecase } from '../../application/usecases/auth/signin.usecase';
import { SignupUsecase } from '../../application/usecases/auth/signup.usecase';
import { LogoutUsecase } from '../../application/usecases/auth/logout.usecase';
import { RefreshUsecase } from '../../application/usecases/auth/refresh.usecase';
import { BanUserUsecase } from '../../application/usecases/user/ban-user.usecase';
import { UnbanUserUsecase } from '../../application/usecases/user/unban-user.usecase';
import { RoleRepository } from '../../infrastructure/orm/repositories/role.repository';
import { GetAllUsersUsecase } from '../../application/usecases/user/get-all-users.usecase';
import { GetUserByIdUsecase } from '../../application/usecases/user/get-user-by-id.usecase';
import { AuthApplicationService } from '../../application/services/auth.application.service';
import { UserApplicationService } from '../../application/services/user.application.service';

/**
 * @class Container
 * @description A simple Dependency Injection container implementing the Service Locator pattern.
 * Responsible for registering and managing services across the application.
 */
export class Container {
  /**
   * @description Singleton instance of the Container.
   * @private
   * @static
   * @type {Container}
   */
  private static instance: Container;

  /**
   * @description Internal map to store registered services.
   * @private
   * @type {Map<string, any>}
   */
  private services: Map<string, any> = new Map();

  /**
   * @private
   * @constructor
   * @description Private constructor to prevent direct instantiation.
   * Calls the method to register all services during initialization.
   */
  private constructor() {
    this.registerServices();
  }

  /**
   * @description Provides global access to the Container singleton instance.
   * Creates the instance if it doesn't exist.
   * @returns {Container} The singleton Container instance.
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * @description Registers all services, repositories, and use cases in the application.
   * Sets up the dependency injection configuration.
   * @private
   */
  private registerServices(): void {
    // Infrastructure layer: Repositories
    const userRepository = new UserRepository(AppDataSource);
    const sessionRepository = new SessionRepository(AppDataSource);
    const roleRepository = new RoleRepository(AppDataSource);

    this.services.set('UserRepository', userRepository);
    this.services.set('SessionRepository', sessionRepository);
    this.services.set('RoleRepository', roleRepository);

    // Common services
    const jwtService = new JwtService();
    const bcryptService = new BcryptService();

    this.services.set('JwtService', jwtService);
    this.services.set('BcryptService', bcryptService);

    const authDomainService = new AuthDomainService(
      this.get('JwtService'),
      this.get('SessionRepository'),
    );

    this.services.set('AuthDomainService', authDomainService);

    // Use Cases (business scenarios)
    this.services.set(
      'SigninUsecase',
      new SigninUsecase(authDomainService, bcryptService, userRepository),
    );
    this.services.set(
      'RefreshUsecase',
      new RefreshUsecase(
        authDomainService,
        jwtService,
        userRepository,
        sessionRepository,
      ),
    );
    this.services.set(
      'SignupUsecase',
      new SignupUsecase(
        userRepository,
        bcryptService,
        roleRepository,
        authDomainService,
      ),
    );
    this.services.set(
      'LogoutUsecase',
      new LogoutUsecase(jwtService, userRepository, sessionRepository),
    );
    this.services.set(
      'GetAllUsersUsecase',
      new GetAllUsersUsecase(userRepository),
    );
    this.services.set(
      'GetUserByIdUsecase',
      new GetUserByIdUsecase(userRepository),
    );
    this.services.set('BanUserUsecase', new BanUserUsecase(userRepository));
    this.services.set('UnbanUserUsecase', new UnbanUserUsecase(userRepository));

    // Transaction Manager
    const transactionManager = new TransactionManager(AppDataSource);
    this.services.set('TransactionManager', transactionManager);

    // Application Services (orchestrators)
    this.services.set(
      'AuthApplicationService',
      new AuthApplicationService(
        this.get('TransactionManager'),
        this.get('SignupUsecase'),
        this.get('SigninUsecase'),
        this.get('LogoutUsecase'),
        this.get('RefreshUsecase'),
      ),
    );

    this.services.set(
      'UserApplicationService',
      new UserApplicationService(
        this.get('TransactionManager'),
        this.get('GetUserByIdUsecase'),
        this.get('GetAllUsersUsecase'),
        this.get('BanUserUsecase'),
        this.get('UnbanUserUsecase'),
      ),
    );
  }

  /**
   * @description Retrieves a registered service by its name.
   * @template T The type of the service to retrieve.
   * @param {string} name - The name of the service to retrieve.
   * @returns {T} The requested service instance.
   * @throws {Error} If the service is not found in the container.
   */
  public get<T>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found in container.`);
    }
    return this.services.get(name);
  }
}

/**
 * @description Global singleton instance of the Container.
 */
export const container = Container.getInstance();
